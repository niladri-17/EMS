import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useWebcam from './hooks/useWebcam';
import useFullscreen from './hooks/useFullscreen';
import useFocusDetection from './hooks/useFocusDetection';
import { useExam } from './context/ExamContext';

const AntiCheatSystem = ({ active = true, onViolation = () => {} }) => {
  const navigate = useNavigate();
  const { isFullscreen, enterFullscreen } = useFullscreen();
  const { hasPermission, stream, isActive } = useWebcam();
  const { showToast, endExam } = useExam();
  const { hasFocus } = useFocusDetection(
    () => handleViolation('tab_switch'),
    () => {}
  );
  
  const [showWarning, setShowWarning] = useState(false);
  const [warningType, setWarningType] = useState('');
  const [warningTimer, setWarningTimer] = useState(10);
  const warningTimerRef = useRef(null);
  
  const checkWebcam = () => {
    return isActive;
  };
  
  const handleViolation = (type) => {
    if (!active) return;
    
    setWarningType(type);
    setShowWarning(true);
    setWarningTimer(10);
    
    onViolation(type);
    
    clearInterval(warningTimerRef.current);
    warningTimerRef.current = setInterval(() => {
      setWarningTimer(prev => {
        if (prev <= 1) {
          clearInterval(warningTimerRef.current);
          setShowWarning(false);
          terminateExam(type);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const terminateExam = (reason) => {
    endExam();
    showToast('Exam terminated due to security violations', 'error');
    navigate('/');
  };
  
  const resolveViolation = () => {
    setShowWarning(false);
    clearInterval(warningTimerRef.current);
  };
  
  useEffect(() => {
    if (!active) {
      setShowWarning(false);
      clearInterval(warningTimerRef.current);
      return;
    }
    
    const handleFullscreenChange = () => {
      if (!isFullscreen && active) {
        handleViolation('fullscreen_exit');
      }
    };
    
    let webcamCheckInterval = null;
    
    if (active) {
      webcamCheckInterval = setInterval(() => {
        if (hasPermission && !checkWebcam()) {
          handleViolation('webcam_disabled');
        }
      }, 5000);
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      
      if (webcamCheckInterval) {
        clearInterval(webcamCheckInterval);
      }
      clearInterval(warningTimerRef.current);
    };
  }, [active, isFullscreen, hasPermission, isActive]);
  
  useEffect(() => {
    if (!active) return;
    
    if (!hasFocus) {
      handleViolation('tab_switch');
    }
  }, [hasFocus, active]);
  
  useEffect(() => {
    if (warningType === 'webcam_disabled' && isActive) {
      resolveViolation();
    }
    
    if (warningType === 'fullscreen_exit' && isFullscreen) {
      resolveViolation();
    }
  }, [isActive, isFullscreen, warningType]);
  
  const violationMessages = {
    webcam_disabled: 'Your webcam has been turned off or disconnected.',
    fullscreen_exit: 'You have exited fullscreen mode.',
    tab_switch: 'You have switched to another tab or application.'
  };
  
  const violationActions = {
    webcam_disabled: 'Please enable your webcam and click "Continue Exam"',
    fullscreen_exit: 'Please return to fullscreen mode and click "Continue Exam"',
    tab_switch: 'Please stay on this tab and click "Continue Exam"'
  };
  
  const handleContinue = () => {
    if (warningType === 'webcam_disabled' && !checkWebcam()) {
      return;
    }
    
    if (warningType === 'fullscreen_exit' && !isFullscreen) {
      document.documentElement.requestFullscreen();
    }
    
    resolveViolation();
  };
  
  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            initial={{ y: 20, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-danger-light rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900">Exam Security Violation</h3>
              <p className="mt-2 text-gray-600">{violationMessages[warningType]}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Auto-cancellation in:</span>
                <span className="text-2xl font-bold text-danger">{warningTimer}s</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-danger" 
                  initial={{ width: '100%' }}
                  animate={{ width: `${(warningTimer / 10) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            
            <p className="mb-6 text-sm text-gray-600">
              {violationActions[warningType]}
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  resolveViolation();
                  terminateExam(warningType);
                }}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                End Exam
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-700"
              >
                Continue Exam
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AntiCheatSystem;