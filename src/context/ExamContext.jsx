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
    hasFocus: true,
    violationCount: 0,
    securityEnabled: false,
    violations: [],
    lastViolationType: null,
    examInProgress: false,
    user: null,
    toast: { show: false, message: '', type: 'success' }
  });

  const updateExamState = (newState) => {
    setExamState(prevState => ({
      ...prevState,
      ...newState
    }));
  };
  
  const logViolation = (type) => {
    const timestamp = new Date().toISOString();
    const violation = { type, timestamp };
    
    setExamState(prevState => ({
      ...prevState,
      violationCount: prevState.violationCount + 1,
      lastViolationType: type,
      violations: [...prevState.violations, violation]
    }));
    
    return violation;
  };
  
  const enableSecurity = () => {
    setExamState(prevState => ({
      ...prevState,
      securityEnabled: true,
      webcamEnabled: true,
      fullscreenEnabled: true,
      hasFocus: true,
      violationCount: 0,
      violations: []
    }));
  };
  
  const disableSecurity = () => {
    setExamState(prevState => ({
      ...prevState,
      securityEnabled: false
    }));
  };
  
  const startExam = (exam) => {
    setExamState(prevState => ({
      ...prevState,
      currentExam: exam,
      examStartTime: new Date().toISOString(),
      examInProgress: true,
      answers: {}
    }));
    
    enableSecurity();
  };
  
  const endExam = () => {
    setExamState(prevState => ({
      ...prevState,
      examInProgress: false
    }));
    
    disableSecurity();
  };

  const showToast = (message, type = 'success') => {
    setExamState(prevState => ({
      ...prevState,
      toast: { show: true, message, type }
    }));

    setTimeout(() => {
      setExamState(prevState => ({
        ...prevState,
        toast: { ...prevState.toast, show: false }
      }));
    }, 3000);
  };

  const value = {
    examState,
    updateExamState,
    logViolation,
    enableSecurity,
    disableSecurity,
    startExam,
    endExam,
    showToast
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