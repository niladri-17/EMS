import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useStudentStore } from "../store/useStudentStore";

const ExamPage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [showAlert, setShowAlert] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [score, setScore] = useState(0);
  const timerRef = useRef(null);
  const { examId, fetchExamQuestions, examQuestions } = useStudentStore();

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
    if (!currentQuestion) return;

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

  const handleExamEnd = () => {
    if (!examQuestions || examQuestions.length === 0) return;

    let correctCount = 0;
    Object.keys(answers).forEach((questionId) => {
      const question = examQuestions.find((q) => q.id === parseInt(questionId));
      if (question && answers[questionId] === question.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    setScore(calculatedScore);
    setExamFinished(true);
    clearInterval(timerRef.current);
  };

  const handleSubmitExam = () => {
    if (Object.keys(answers).length < totalQuestions) {
      setShowAlert(true);
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
      <AnimatePresence mode="wait">
        {!examFinished ? (
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
                      backgroundColor:
                        timeLeft < 5 * 60 ? "#ef4444" : "#0a6edf",
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

            {currentQuestion && (
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
            )}

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
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-display font-semibold text-gray-900">
                          Unanswered Questions
                        </h3>
                        <p className="mt-2 text-gray-600">
                          You haven't answered all questions yet. Please review
                          and complete all questions before submitting.
                        </p>
                        <div className="mt-4 flex gap-3">
                          <motion.button
                            onClick={() => setShowAlert(false)}
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
        ) : (
          <motion.div
            key="results"
            className="max-w-lg mx-auto bg-white rounded-2xl shadow-soft p-8 text-center"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.2,
              }}
              className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(${
                  score >= 70 ? "#22c55e" : "#ef4444"
                } ${score}%, #e2e8f0 0)`,
              }}
            >
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                <div
                  className={`text-3xl font-bold ${
                    score >= 70 ? "text-success" : "text-danger"
                  }`}
                >
                  {score}%
                </div>
              </div>
            </motion.div>

            <h2 className="text-2xl font-display font-bold mb-2">
              {score >= 70 ? "Congratulations!" : "Exam Completed"}
            </h2>

            <p className="text-gray-600 mb-6">
              {score >= 70
                ? "You have successfully passed the history quiz."
                : "Unfortunately, you did not meet the passing score."}
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-left">
                  <div className="text-sm text-gray-500">Total Questions</div>
                  <div className="font-semibold">{totalQuestions}</div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-500">Answered</div>
                  <div className="font-semibold">
                    {Object.keys(answers).length}
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-500">Time Taken</div>
                  <div className="font-semibold">
                    {formatTime(30 * 60 - timeLeft)}
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-500">Result</div>
                  <div
                    className={`font-semibold ${
                      score >= 70 ? "text-success" : "text-danger"
                    }`}
                  >
                    {score >= 70 ? "Passed" : "Failed"}
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleReturnHome}
              className="btn-primary w-full py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Return to Home
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExamPage;
