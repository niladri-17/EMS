import { createContext, useState, useContext } from 'react';

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [examState, setExamState] = useState({
    isAuthenticated: false,
    hasPermissions: false,
    currentExam: null,
    answers: {},
    examStartTime: null,
    webcamEnabled: false,
    fullscreenEnabled: false,
    user: null
  });

  const updateExamState = (newState) => {
    setExamState(prevState => ({
      ...prevState,
      ...newState
    }));
  };

  const value = {
    examState,
    updateExamState
  };

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};

export default ExamContext;