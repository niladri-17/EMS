import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useExam } from '../context/ExamContext';
import useWebcam from '../hooks/useWebcam';
import useFullscreen from '../hooks/useFullscreen';
import AntiCheatSystem from '../AntiCheatSystem';

const ExamPreparationPage = () => {
  const navigate = useNavigate();
  const { examState, updateExamState, logViolation, startExam } = useExam();
  const { isActive, videoRef, reconnect } = useWebcam();
  const { isFullscreen, enterFullscreen } = useFullscreen();
  const [showWebcam, setShowWebcam] = useState(true);
  
  const handleStartExam = () => {
  if (!isActive || !isFullscreen) {
    if (!isActive) {
      reconnect();
      logViolation('webcam_disabled');
    }
    
    if (!isFullscreen) {
      enterFullscreen();
      logViolation('fullscreen_exit');
    }
    
    return;
  }
  
  const exam = {
    id: 1,
    title: 'History Quiz',
    subject: 'History',
    topic: 'World History',
    duration: 30,
    totalQuestions: 5,
    passingScore: 70
  };
  
  startExam(exam);
  navigate('/exam');
};
  
  useEffect(() => {
  if (!examState.hasPermissions) {
    navigate('/permissions');
  }
  
  if (!isFullscreen) {
    enterFullscreen();
  }
  
  if (!isActive) {
    reconnect();
  }
  
  const webcamInterval = setInterval(() => {
    if (!isActive) {
      reconnect();
    }
  }, 5000);
  
  return () => clearInterval(webcamInterval);
}, [examState.hasPermissions, navigate, isActive, reconnect, isFullscreen, enterFullscreen]);
  
  const handleViolation = (type) => {
    logViolation(type);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <AntiCheatSystem
        active={true}
        onViolation={handleViolation}
      />
      
      <motion.div 
        className="max-w-4xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
         
          <div className="bg-gradient-to-r from-primary-700 to-primary p-6 text-center">
            <h1 className="text-3xl font-display font-bold text-white">History Quiz</h1>
            <p className="mt-2 text-blue-100">
              Review the details below and start when you're ready
            </p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <motion.div 
                className="md:col-span-2 space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-display font-semibold text-primary-800 border-b border-gray-200 pb-2 mb-4">
                      Exam Information
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                          </svg>
                          Subject:
                        </span>
                        <span className="font-medium text-gray-800">History</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Topic:
                        </span>
                        <span className="font-medium text-gray-800">World History</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Duration:
                        </span>
                        <span className="font-medium text-gray-800">30 minutes</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Questions:
                        </span>
                        <span className="font-medium text-gray-800">5 questions</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Passing Score:
                        </span>
                        <span className="font-medium text-gray-800">70%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-display font-semibold text-primary-800 border-b border-gray-200 pb-2 mb-4">
                      Rules & Guidelines
                    </h2>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs mt-0.5">
                          1
                        </div>
                        <span className="ml-2">Do not refresh the page during the exam</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs mt-0.5">
                          2
                        </div>
                        <span className="ml-2">Do not switch to other tabs or applications</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs mt-0.5">
                          3
                        </div>
                        <span className="ml-2">Ensure your webcam is on at all times</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs mt-0.5">
                          4
                        </div>
                        <span className="ml-2">Complete the exam within the allotted time</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs mt-0.5">
                          5
                        </div>
                        <span className="ml-2">Answer all questions to the best of your ability</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs mt-0.5">
                          6
                        </div>
                        <span className="ml-2">Any suspicious activity will be flagged</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Security Status</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                        <span className={`text-sm ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {isActive ? 'Webcam Active' : 'Webcam Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${isFullscreen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-sm ${isFullscreen ? 'text-green-600' : 'text-red-600'}`}>
                          {isFullscreen ? 'Fullscreen Mode' : 'Not Fullscreen'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2 bg-green-500"></div>
                        <span className="text-sm text-green-600">Focus Monitoring Active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-warning rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-warning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-800">
                          If you exit fullscreen mode, switch tabs, or disable your webcam, your exam may be automatically terminated after a 10-second warning.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div
                className="md:col-span-1"
                variants={itemVariants}
              >
                <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Webcam Check</h3>
                    <button 
                      className="text-sm text-primary" 
                      onClick={() => setShowWebcam(!showWebcam)}
                    >
                      {showWebcam ? 'Hide' : 'Show'} webcam
                    </button>
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
                            <svg className="w-10 h-10 mx-auto mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
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
                  
                  {!isActive && (
                    <div className="my-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                      <p className="text-sm text-red-700">
                        <span className="font-bold">Required:</span> Your webcam must be enabled to take the exam. Please allow webcam access in your browser.
                      </p>
                    </div>
                  )}
                  
                  {!isFullscreen && (
                    <button 
                      onClick={enterFullscreen}
                      className="mt-4 w-full py-2 bg-primary text-white rounded-md text-sm flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                      </svg>
                      Enter Fullscreen
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button 
                onClick={handleStartExam}
                className={`btn-primary px-10 py-4 text-lg flex items-center gap-2 shadow-lg hover:shadow-xl ${
                  !isActive || !isFullscreen ? 'opacity-70' : ''
                }`}
                whileHover={{ scale: isActive && isFullscreen ? 1.03 : 1 }}
                whileTap={{ scale: isActive && isFullscreen ? 0.97 : 1 }}
                disabled={!isActive || !isFullscreen}
              >
                {!isActive || !isFullscreen ? (
                  <>
                    <span>Please Enable Required Permissions</span>
                  </>
                ) : (
                  <>
                    <span>Start Quiz</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
          
          <div className="bg-gray-50 p-4 border-t flex justify-center">
            <div className="flex space-x-2">
              <div className="h-2 w-8 rounded-full bg-primary"></div>
              <div className="h-2 w-8 rounded-full bg-primary"></div>
              <div className="h-2 w-8 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExamPreparationPage;