import { motion } from 'framer-motion';

const MainLayout = ({ children }) => {
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
     
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary opacity-5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent opacity-5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
        
        <motion.div 
          className="absolute top-1/4 left-1/4 w-16 h-16 bg-primary opacity-5 rounded-full"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-accent opacity-5 rounded-full"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        ></motion.div>
      </div>
      
      <motion.main 
        className="relative z-10 container mx-auto py-8 px-4 sm:px-6 lg:px-8"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
      </motion.main>
      
      <footer className="relative z-10 container mx-auto py-4 px-4 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Secure Exam Portal • Privacy Policy</p>
      </footer>
    </div>
  );
};

export default MainLayout;