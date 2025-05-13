import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const PermissionItem = ({ icon, title, description, granted = false, onGrant }) => {
  return (
    <motion.div 
      className={`p-4 mb-4 border rounded-lg flex items-start ${
        granted ? 'border-green-500 bg-green-50' : 'border-gray-300'
      }`}
      whileHover={{ scale: 1.01 }}
    >
      <div className="text-2xl mr-4 text-primary">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      <div className="ml-4">
        {granted ? (
          <div className="bg-green-500 text-white rounded-full p-2">
            <FaCheck />
          </div>
        ) : (
          <motion.button
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
            whileTap={{ scale: 0.95 }}
            onClick={onGrant}
          >
            Allow
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default PermissionItem;