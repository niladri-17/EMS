import { useState, useEffect } from 'react';

const useFocusDetection = (onFocusLost = () => {}, onFocusRegained = () => {}) => {
  const [hasFocus, setHasFocus] = useState(true);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      const newFocusState = !document.hidden;
      
      if (newFocusState !== hasFocus) {
        setHasFocus(newFocusState);
        
        if (newFocusState) {
          onFocusRegained();
        } else {
          onFocusLost();
        }
      }
    };
    
    const handleFocus = () => {
      setHasFocus(true);
      onFocusRegained();
    };
    
    const handleBlur = () => {
      setHasFocus(false);
      onFocusLost();
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [hasFocus, onFocusLost, onFocusRegained]);
  
  return { hasFocus };
};

export default useFocusDetection;