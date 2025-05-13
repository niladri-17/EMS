import { useState, useEffect, useRef } from 'react';

const useWebcam = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const requestPermission = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setHasPermission(true);
      setError(null);
      
      return true;
    } catch (err) {
      setError(err.message);
      setHasPermission(false);
      return false;
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return {
    hasPermission,
    requestPermission,
    stopWebcam,
    videoRef,
    error
  };
};

export default useWebcam;