import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const ExamTimer = ({ durationInMinutes, onTimeUp = () => {} }) => {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);
  const [isWarning, setIsWarning] = useState(false);
  const [isDanger, setIsDanger] = useState(false);
  const circumference = 2 * Math.PI * 40;
  const timerRef = useRef(null);
  
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timerRef.current);
  }, [onTimeUp, durationInMinutes]);
  
  useEffect(() => {
    const warningThreshold = durationInMinutes * 60 * 0.25;
    const dangerThreshold = durationInMinutes * 60 * 0.1; 
    
    setIsWarning(timeLeft <= warningThreshold);
    setIsDanger(timeLeft <= dangerThreshold);
  }, [timeLeft, durationInMinutes]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progressPercentage = (timeLeft / (durationInMinutes * 60)) * 100;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;
  
  const getColor = () => {
    if (isDanger) return '#ef4444'; 
    if (isWarning) return '#f59e0b'; 
    return '#0a6edf'; 
  };
  
  return (
    <div className="flex items-center">
      <div className="relative flex items-center justify-center mr-3">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            className="stroke-gray-200"
            strokeWidth="8"
            fill="transparent"
          />
          
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            className="stroke-current"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ 
              strokeDashoffset,
              stroke: getColor()
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className="text-lg font-semibold"
            style={{ color: getColor() }}
            animate={{ 
              scale: isDanger ? [1, 1.1, 1] : 1,
              color: getColor() 
            }}
            transition={{ 
              scale: { 
                repeat: isDanger ? Infinity : 0, 
                duration: 1.5,
                repeatType: "loop" 
              },
              color: { duration: 0.5 }
            }}
          >
            {formatTime(timeLeft)}
          </motion.span>
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Time Remaining</span>
        <span className="text-base font-medium" style={{ color: getColor() }}>
          {isDanger ? 'Hurry up!' : isWarning ? 'Almost done!' : 'Keep going!'}
        </span>
      </div>
    </div>
  );
};

export default ExamTimer;