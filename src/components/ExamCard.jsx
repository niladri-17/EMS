import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const ExamCard = ({ title, duration, questions, onClick }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Duration:</span>
          <span className="font-medium">{duration} minutes</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Questions:</span>
          <span className="font-medium">{questions}</span>
        </div>
      </div>
      <motion.button
        className="w-full mt-6 bg-primary text-white py-2 rounded-md flex items-center justify-center space-x-2"
        whileHover={{ backgroundColor: '#4a5f7a' }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        <span>Start</span>
        <FaArrowRight size={14} />
      </motion.button>
    </motion.div>
  );
};

export default ExamCard;