import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const QuestionCard = ({ 
  question, 
  image, 
  options, 
  questionNumber, 
  totalQuestions, 
  selectedOption = null,
  onAnswer,
  feedback = null,
  showAnswer = false,
  correctAnswer = null
}) => {
  const [focusedOption, setFocusedOption] = useState(null);
  
  const handleOptionSelect = (index) => {
    if (onAnswer && !showAnswer) {
      onAnswer(index);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.08
      }
    },
    exit: { opacity: 0, y: -20 }
  };
  
  const optionVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };
  
  const getOptionStyles = (index) => {
   
    if (showAnswer) {
      if (index === correctAnswer) {
        return 'border-success bg-success-light/20';
      } else if (index === selectedOption && index !== correctAnswer) {
        return 'border-danger bg-danger-light/20';
      } else {
        return 'border-gray-200';
      }
    }
    
    
    if (index === selectedOption) {
      return 'border-primary bg-blue-50';
    } else if (index === focusedOption) {
      return 'border-gray-300 bg-gray-50';
    } else {
      return 'border-gray-200 hover:border-gray-300';
    }
  };
  
  return (
    <motion.div
      className="bg-white rounded-xl shadow-soft overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-display font-semibold text-gray-800">
            Question {questionNumber} of {totalQuestions}
          </h3>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
            {Math.round((questionNumber / totalQuestions) * 100)}% Complete
          </span>
        </div>
        
       
        <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>
      
      
      <div className="p-6">
        <p className="text-gray-800 text-lg leading-relaxed mb-6">{question}</p>
        
        {image && (
          <div className="mb-6 overflow-hidden rounded-lg">
            <motion.img 
              src={image} 
              alt="Question illustration" 
              className="w-full h-auto"
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
        
        <div className="space-y-3 mt-6">
          {options.map((option, index) => (
            <motion.div
              key={index}
              variants={optionVariants}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${getOptionStyles(index)}`}
              onMouseEnter={() => setFocusedOption(index)}
              onMouseLeave={() => setFocusedOption(null)}
              onClick={() => handleOptionSelect(index)}
              whileHover={!showAnswer ? { scale: 1.01, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' } : {}}
              whileTap={!showAnswer ? { scale: 0.99 } : {}}
            >
              <div className="flex items-center">
                
                <div className={`flex-shrink-0 h-6 w-6 rounded-full mr-4 flex items-center justify-center border-2 ${
                  index === selectedOption 
                    ? 'border-primary' 
                    : 'border-gray-300'
                }`}>
                 
                  {showAnswer && index === correctAnswer && (
                    <motion.svg 
                      className="w-4 h-4 text-success" 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </motion.svg>
                  )}
                  
                 
                  {showAnswer && index === selectedOption && index !== correctAnswer && (
                    <motion.svg 
                      className="w-4 h-4 text-danger" 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                    </motion.svg>
                  )}
                  
               
                  {!showAnswer && index === selectedOption && (
                    <motion.div 
                      className="h-3 w-3 rounded-full bg-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
                
                <div className={`flex-shrink-0 h-7 w-7 rounded-full mr-3 flex items-center justify-center text-sm ${
                  index === selectedOption 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                
               
                <span className={`font-medium ${
                  showAnswer && (
                    (index === correctAnswer) 
                      ? 'text-success' 
                      : (index === selectedOption && index !== correctAnswer) 
                        ? 'text-danger'
                        : ''
                  )
                }`}>
                  {option}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <AnimatePresence>
          {showAnswer && feedback && (
            <motion.div 
              className={`mt-6 p-4 rounded-lg ${
                selectedOption === correctAnswer 
                  ? 'bg-success-light/20 border-l-4 border-success' 
                  : 'bg-danger-light/20 border-l-4 border-danger'
              }`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="text-gray-800">
                <span className="font-semibold">
                  {selectedOption === correctAnswer ? 'Correct! ' : 'Incorrect. '}
                </span>
                {feedback}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuestionCard;