import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useStudentStore } from "../store/useStudentStore";
import { useExam } from "../context/ExamContext";
import useWebcam from "../hooks/useWebcam";
import useFullscreen from "../hooks/useFullscreen";
import AntiCheatSystem from "../antiCheatSystem";

const ExamPage = () => {
  const navigate = useNavigate();
  const { examState, updateExamState, logViolation, endExam, showToast } =
    useExam();
  const { isActive, videoRef, reconnect, stopWebcam } = useWebcam();
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [showAlert, setShowAlert] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [showWebcam, setShowWebcam] = useState(false);

  const timerRef = useRef(null);
  const { examId, fetchExamQuestions, examQuestions, saveAttempt } =
    useStudentStore();

  // useEffect(() => {
  //   if (!examState.hasPermissions) {
  //     navigate("/permissions");
  //   }
  // }, [examState.hasPermissions, navigate]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          handleExamEnd();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  console.log(examState.violations);

  useEffect(() => {
    return () => {
      disableAntiCheatMeasures();
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const webcamCheckInterval = setInterval(() => {
      if (!isActive) {
        reconnect();
      }
    }, 5000);

    return () => clearInterval(webcamCheckInterval);
  }, [isActive, reconnect]);

  useEffect(() => {
    const loadExamQuestions = async () => {
      try {
        await fetchExamQuestions(examId);
        console.log(examId);
      } catch (error) {
        console.error("Error fetching exam questions:", error);
      }
    };

    loadExamQuestions();
  }, [fetchExamQuestions, examId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimeProgress = () => {
    return (timeLeft / (30 * 60)) * 100;
  };

  // Check if examQuestions exists and has elements before accessing
  const totalQuestions = examQuestions?.length || 0;
  const currentQuestion =
    totalQuestions > 0 ? examQuestions[currentQuestionIndex] : null;

  const handleAnswerSelect = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionIndex,
    });
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const disableAntiCheatMeasures = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      videoRef.current.srcObject = null;
    }

    stopWebcam();

    if (isFullscreen) {
      exitFullscreen();
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      })
      .catch((err) => console.log("No additional media streams to clean up"));
  };

  const handleExamEnd = () => {
    disableAntiCheatMeasures();

    let correctCount = 0;
    Object.keys(answers).forEach((questionId) => {
      const question = sampleQuestions.find(
        (q) => q.id === parseInt(questionId)
      );
      if (question && answers[questionId] === question.correctAnswer) {
        correctCount++;
      }
    });
  };

  const handleExamTermination = (reason) => {
    disableAntiCheatMeasures();

    clearInterval(timerRef.current);

    endExam();

    setTimeout(disableAntiCheatMeasures, 500);

    showToast("Exam terminated due to security violations", "error");
    navigate("/");
  };

  const handleSubmitExam = () => {
    if (Object.keys(answers).length < totalQuestions) {
      setShowAlert(true);
      saveAttempt(data);
      return;
    }

    handleExamEnd();
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  const isQuestionAnswered = (questionId) => {
    return answers[questionId] !== undefined;
  };

  const handleViolation = (type) => {
    logViolation(type);
    setViolationCount((prev) => prev + 1);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Show loading state when questions are not yet loaded
  if (!examQuestions || examQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <AntiCheatSystem active={true} onViolation={handleViolation} />

      <motion.div
        key="exam"
        className="max-w-4xl mx-auto"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-display font-bold text-primary mb-4 md:mb-0">
            History Quiz
          </h1>

          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-md">
            <svg
              className="w-5 h-5 text-primary mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div className="relative w-24 h-8">
              <span
                className={`absolute inset-0 flex items-center justify-center font-semibold text-lg ${
                  timeLeft < 5 * 60
                    ? "text-danger animate-pulse"
                    : "text-primary"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="w-20 h-2 bg-gray-200 rounded-full ml-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${getTimeProgress()}%`,
                  backgroundColor: timeLeft < 5 * 60 ? "#ef4444" : "#0a6edf",
                }}
                animate={{ width: `${getTimeProgress()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-500">
              Question Navigation
            </h3>
            <span className="text-sm text-primary font-medium">
              {Object.keys(answers).length}/{totalQuestions} Answered
            </span>
          </div>
          <div className="flex justify-center space-x-3">
            {examQuestions.map((question, index) => (
              <motion.button
                key={question.id}
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all ${
                  currentQuestionIndex === index
                    ? "bg-primary text-white font-medium shadow-md scale-110"
                    : isQuestionAnswered(question.id)
                    ? "bg-success text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
                whileHover={{
                  scale: currentQuestionIndex === index ? 1.1 : 1.05,
                }}
                whileTap={{ scale: 0.95 }}
              >
                {index + 1}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-2">
            <motion.div
              className="card mb-6"
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-display font-semibold text-primary">
                    Question {currentQuestionIndex + 1}/{totalQuestions}
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    ID: #{currentQuestion.id}
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-2">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${
                        ((currentQuestionIndex + 1) / totalQuestions) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <p className="text-gray-800 text-lg mb-6 leading-relaxed">
                {currentQuestion.question}
              </p>

              <div className="mt-6 space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      answers[currentQuestion.id] === index
                        ? "border-primary bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                    whileHover={{
                      scale: 1.01,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center">
                      <div
                        className={`h-6 w-6 min-w-6 mr-4 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion.id] === index
                            ? "border-primary bg-white"
                            : "border-gray-300"
                        }`}
                      >
                        {answers[currentQuestion.id] === index && (
                          <motion.div
                            className="h-3 w-3 rounded-full bg-primary"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="flex justify-between">
              <motion.button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`btn-secondary flex items-center gap-2 ${
                  currentQuestionIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                whileHover={currentQuestionIndex !== 0 ? { scale: 1.02 } : {}}
                whileTap={currentQuestionIndex !== 0 ? { scale: 0.98 } : {}}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
                <span>Previous</span>
              </motion.button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <motion.button
                  onClick={handleNextQuestion}
                  className="btn-primary flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Next</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleSubmitExam}
                  className="bg-success hover:bg-success-dark text-white font-medium py-2.5 px-6 rounded-lg flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Submit Exam</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </motion.button>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Security Status</h3>
                <button
                  className="text-sm text-primary"
                  onClick={() => setShowWebcam(!showWebcam)}
                >
                  {showWebcam ? "Hide" : "Show"} webcam
                </button>
              </div>

              <div className="space-y-4 mb-4">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      isActive ? "bg-green-500" : "bg-red-500 animate-pulse"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-700">
                    {isActive
                      ? "Webcam active"
                      : "Webcam inactive - please enable"}
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      isFullscreen ? "bg-green-500" : "bg-red-500 animate-pulse"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-700">
                    {isFullscreen
                      ? "Fullscreen active"
                      : "Not in fullscreen - please enable"}
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      violationCount > 0 ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-700">
                    {violationCount > 0
                      ? `${violationCount} violations detected`
                      : "No violations detected"}
                  </span>
                </div>
              </div>

              {showWebcam && (
                <div className="flex-grow relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
                      <div className="text-center p-4">
                        <svg
                          className="w-10 h-10 mx-auto mb-2 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          ></path>
                        </svg>
                        <p className="text-sm">Webcam inactive</p>
                        <button
                          className="mt-2 px-3 py-1 bg-primary text-white rounded-md text-sm"
                          onClick={reconnect}
                        >
                          Reconnect
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!showWebcam && (
                <div className="flex-grow flex items-center justify-center text-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <svg
                      className="w-12 h-12 mx-auto mb-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <p className="text-sm text-gray-500">
                      Your webcam is still being monitored even when hidden.
                      Click "Show webcam" to view your camera feed.
                    </p>
                  </div>
                </div>
              )}

              {!isFullscreen && (
                <button
                  onClick={enterFullscreen}
                  className="mt-4 w-full py-2 bg-primary text-white rounded-md text-sm flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    ></path>
                  </svg>
                  Enter Fullscreen
                </button>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showAlert && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-warning-light rounded-full p-2">
                    <svg
                      className="w-6 h-6 text-warning"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.756 2.722-1.756 3.486 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-display font-semibold text-gray-900">
                      Unanswered Questions
                    </h3>
                    <p className="mt-2 text-gray-600">
                      You haven't answered all questions yet. Please review and
                      complete all questions before submitting.
                    </p>
                    <div className="mt-4 flex gap-3">
                      <motion.button
                        onClick={async () => {
                          try {
                            // Now enterFullscreen() returns a promise we can await
                            await enterFullscreen();
                            setShowAlert(false);
                          } catch (error) {
                            console.error("Failed to enter fullscreen:", error);
                            // Still hide the alert even if fullscreen fails
                            setShowAlert(false);
                          }
                        }}
                        className="btn-secondary flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue Exam
                      </motion.button>
                      <motion.button
                        onClick={handleExamEnd}
                        className="btn-primary flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Submit Anyway
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ExamPage;
