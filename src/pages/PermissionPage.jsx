import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useWebcam from '../hooks/useWebcam';
import useFullscreen from '../hooks/useFullscreen';
import useFocusDetection from '../hooks/useFocusDetection';
import { useExam } from '../context/ExamContext';
import AntiCheatSystem from '../AntiCheatSystem';

const PermissionPage = () => {
  const navigate = useNavigate();
  const { updateExamState, enableSecurity } = useExam();
  const { requestPermission, hasPermission, isActive, videoRef, reconnect } = useWebcam();
  const { isFullscreen, enterFullscreen, isFullscreenAvailable, fullscreenError } = useFullscreen();
  const { hasFocus } = useFocusDetection();
  
  const [permissions, setPermissions] = useState({
    camera: false,
    fullscreen: false,
    microphone: false,
    tabSwitching: false,
    browserWarning: false
  });
  
  const [error, setError] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  
  const handlePermissionChange = (permission) => {
    setPermissions({
      ...permissions,
      [permission]: !permissions[permission]
    });
  };
  
  const allPermissionsGranted = Object.values(permissions).every(Boolean);
  
  const handleContinue = () => {
  if (allPermissionsGranted) {
    updateExamState({ 
      hasPermissions: true,
      webcamEnabled: isActive,
      fullscreenEnabled: isFullscreen, 
      hasFocus: true
    });
    
    enableSecurity();
    navigate('/exam-prep');
  }
};
  
  const requestCameraPermission = async () => {
    try {
      const result = await requestPermission();
      if (result) {
        handlePermissionChange('camera');
        setShowWebcam(true);
      } else {
        setError('Camera permission was denied. Please allow camera access to continue.');
      }
    } catch (error) {
      setError(`Camera permission error: ${error.message}`);
    }
  };
  
  const requestFullscreenPermission = async () => {
    try {
      if (!isFullscreenAvailable()) {
        setError('Fullscreen is not supported in your browser. Please try another browser.');
        return;
      }
      
      const result = await enterFullscreen();
      if (result) {
        handlePermissionChange('fullscreen');
      } else {
        setError('Fullscreen permission was denied. Please allow fullscreen mode to continue.');
      }
    } catch (error) {
      setError(`Fullscreen error: ${error.message}`);
    }
  };
  
  const handleMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      handlePermissionChange('microphone');
    } catch (error) {
      setError(`Microphone permission error: ${error.message}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  useEffect(() => {
    if (isFullscreen) {
      setPermissions(prev => ({
        ...prev,
        fullscreen: true
      }));
    } else {
      setPermissions(prev => ({
        ...prev,
        fullscreen: false
      }));
    }
  }, [isFullscreen]);
  
  useEffect(() => {
    if (isActive) {
      setPermissions(prev => ({
        ...prev,
        camera: true
      }));
      setShowWebcam(true);
    } else {
      setPermissions(prev => ({
        ...prev,
        camera: false
      }));
    }
  }, [isActive]);
  
  useEffect(() => {
    if (permissions.camera && !isActive) {
      const interval = setInterval(() => {
        reconnect();
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [permissions.camera, isActive, reconnect]);
  
  const permissionIcons = {
    camera: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
    ),
    fullscreen: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
      </svg>
    ),
    microphone: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
      </svg>
    ),
    tabSwitching: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    ),
    browserWarning: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>
    )
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div 
        className="max-w-6xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="bg-gradient-to-r from-primary-700 to-primary p-6 text-center">
            <h1 className="text-3xl font-display font-bold text-white">Exam Security Setup</h1>
            <p className="mt-2 text-blue-100">
              Please grant the following permissions to proceed with your exam
            </p>
          </div>
          
          <div className="p-6 md:p-8">
            {error && (
              <motion.div 
                className="bg-danger-light border-l-4 border-danger rounded-lg p-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-sm text-danger-dark">{error}</p>
              </motion.div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <motion.div 
                className="md:col-span-3 space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <motion.div 
                  variants={itemVariants}
                  className={`p-4 border-2 rounded-xl flex items-start ${
                    permissions.camera ? 'border-success bg-success-light/20' : 'border-gray-200'
                  }`}
                >
                  <div className={`mr-4 p-2 rounded-lg ${permissions.camera ? 'text-success bg-success-light' : 'text-primary bg-blue-100'}`}>
                    {permissionIcons.camera}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-display font-semibold">Camera Access</h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      We need access to your camera to monitor you during the exam to prevent cheating. If your webcam is turned off during the exam, it will be flagged as a violation.
                    </p>
                  </div>
                  <div className="ml-4 flex items-center">
                    {permissions.camera ? (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-success text-white rounded-full p-1"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </motion.div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary"
                        onClick={requestCameraPermission}
                      >
                        Allow
                      </motion.button>
                    )}
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className={`p-4 border-2 rounded-xl flex items-start ${
                    permissions.fullscreen ? 'border-success bg-success-light/20' : 'border-gray-200'
                  }`}
                >
                  <div className={`mr-4 p-2 rounded-lg ${permissions.fullscreen ? 'text-success bg-success-light' : 'text-primary bg-blue-100'}`}>
                    {permissionIcons.fullscreen}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-display font-semibold">Fullscreen Mode</h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      The exam must be taken in fullscreen mode to prevent accessing other resources. Exiting fullscreen during the exam will be flagged as a violation.
                    </p>
                  </div>
                  <div className="ml-4 flex items-center">
                    {permissions.fullscreen ? (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-success text-white rounded-full p-1"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </motion.div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary"
                        onClick={requestFullscreenPermission}
                      >
                        Allow
                      </motion.button>
                    )}
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className={`p-4 border-2 rounded-xl flex items-start ${
                    permissions.microphone ? 'border-success bg-success-light/20' : 'border-gray-200'
                  }`}
                >
                  <div className={`mr-4 p-2 rounded-lg ${permissions.microphone ? 'text-success bg-success-light' : 'text-primary bg-blue-100'}`}>
                    {permissionIcons.microphone}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-display font-semibold">Microphone Access</h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      We need access to your microphone to detect any suspicious sounds or conversations during the exam.
                    </p>
                  </div>
                  <div className="ml-4 flex items-center">
                    {permissions.microphone ? (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-success text-white rounded-full p-1"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </motion.div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary"
                        onClick={handleMicrophonePermission}
                      >
                        Allow
                      </motion.button>
                    )}
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className={`p-4 border-2 rounded-xl flex items-start ${
                    permissions.tabSwitching ? 'border-success bg-success-light/20' : 'border-gray-200'
                  }`}
                >
                  <div className={`mr-4 p-2 rounded-lg ${permissions.tabSwitching ? 'text-success bg-success-light' : 'text-primary bg-blue-100'}`}>
                    {permissionIcons.tabSwitching}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-display font-semibold">Tab Switching Detection</h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      We will detect if you switch to another tab or application during the exam. Any tab or application switching will be flagged as a violation.
                    </p>
                  </div>
                  <div className="ml-4 flex items-center">
                    {permissions.tabSwitching ? (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-success text-white rounded-full p-1"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </motion.div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary"
                        onClick={() => handlePermissionChange('tabSwitching')}
                      >
                        Allow
                      </motion.button>
                    )}
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className={`p-4 border-2 rounded-xl flex items-start ${
                    permissions.browserWarning ? 'border-success bg-success-light/20' : 'border-gray-200'
                  }`}
                >
                  <div className={`mr-4 p-2 rounded-lg ${permissions.browserWarning ? 'text-success bg-success-light' : 'text-primary bg-blue-100'}`}>
                    {permissionIcons.browserWarning}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-display font-semibold">Browser Warning</h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      Any suspicious behavior will be flagged and may result in disqualification. This includes webcam disconnections, exiting fullscreen, or switching tabs.
                    </p>
                  </div>
                  <div className="ml-4 flex items-center">
                    {permissions.browserWarning ? (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-success text-white rounded-full p-1"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </motion.div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary"
                        onClick={() => handlePermissionChange('browserWarning')}
                      >
                        Allow
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div
                className="md:col-span-2"
                variants={itemVariants}
              >
                <motion.div
                  className="bg-white rounded-xl shadow-md p-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Webcam Preview</h3>
                    <button 
                      className="text-sm text-primary" 
                      onClick={() => setShowWebcam(!showWebcam)}
                    >
                      {showWebcam ? 'Hide' : 'Show'} webcam
                    </button>
                  </div>
                  
                  {showWebcam && (
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200 aspect-video mb-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {!isActive && permissions.camera && (
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
                      {!permissions.camera && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
                          <div className="text-center p-4">
                            <svg className="w-10 h-10 mx-auto mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            <p className="text-sm">Camera permission required</p>
                            <button 
                              className="mt-2 px-3 py-1 bg-primary text-white rounded-md text-sm"
                              onClick={requestCameraPermission}
                            >
                              Enable Camera
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!showWebcam && (
                    <div className="aspect-video flex items-center justify-center text-center p-4 bg-gray-50 rounded-lg mb-4">
                      <div>
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                        <p className="text-sm text-gray-500">
                          Click "Show webcam" to check your camera
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 ${permissions.camera && isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm ${permissions.camera && isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {permissions.camera ? (isActive ? 'Camera active' : 'Camera inactive - please reconnect') : 'Camera permission required'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 ${permissions.fullscreen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm ${permissions.fullscreen ? 'text-green-600' : 'text-red-600'}`}>
                        {permissions.fullscreen ? 'Fullscreen mode enabled' : 'Fullscreen permission required'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 ${permissions.microphone ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm ${permissions.microphone ? 'text-green-600' : 'text-red-600'}`}>
                        {permissions.microphone ? 'Microphone permission granted' : 'Microphone permission required'}
                      </span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="bg-yellow-50 border-l-4 border-warning rounded-lg p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                  <p className="text-sm text-yellow-700">
                    During the exam, if your webcam is turned off, you exit fullscreen mode, or switch tabs, your exam may be automatically terminated after a 10-second warning.
                  </p>
                </motion.div>
              </motion.div>
            </div>
            
            <AnimatePresence>
              {!allPermissionsGranted && (
                <motion.div 
                  className="bg-blue-50 border-l-4 border-primary p-4 rounded-lg mb-6 mt-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="text-sm text-primary-800">
                    <span className="font-medium">Important:</span> All permissions are required to ensure exam integrity. Please grant all permissions to continue.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex justify-center mt-8">
              <motion.button 
                onClick={handleContinue} 
                disabled={!allPermissionsGranted}
                className={`btn-primary px-8 py-3 flex items-center gap-2 ${!allPermissionsGranted ? 'opacity-60 cursor-not-allowed' : ''}`}
                whileHover={allPermissionsGranted ? { scale: 1.03 } : {}}
                whileTap={allPermissionsGranted ? { scale: 0.98 } : {}}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span>Continue to Exam</span>
                {allPermissionsGranted && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 border-t flex justify-center">
            <div className="flex space-x-2">
              <div className="h-2 w-8 rounded-full bg-primary"></div>
              <div className="h-2 w-8 rounded-full bg-gray-300"></div>
              <div className="h-2 w-8 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PermissionPage;