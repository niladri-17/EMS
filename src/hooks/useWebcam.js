import { useState, useEffect, useRef } from 'react';

const useWebcam = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef(null);
  const streamCheckIntervalRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const requestPermission = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      setIsActive(true);
      setError(null);
      
      startStreamCheck();
      return true;
    } catch (err) {
      console.error("Webcam permission error:", err);
      setError(err.message);
      setHasPermission(false);
      setIsActive(false);
      return false;
    }
  };
  
  const startStreamCheck = () => {
    if (streamCheckIntervalRef.current) {
      clearInterval(streamCheckIntervalRef.current);
    }
    
    streamCheckIntervalRef.current = setInterval(() => {
      if (stream) {
        const tracks = stream.getVideoTracks();
        const active = tracks.length > 0 && tracks[0].enabled && tracks[0].readyState === 'live';
        setIsActive(active);
      } else {
        setIsActive(false);
      }
    }, 500);
  };
  
  const attemptReconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    reconnectTimeoutRef.current = setTimeout(async () => {
      try {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        setStream(mediaStream);
        setHasPermission(true);
        setIsActive(true);
        setError(null);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          try {
            await videoRef.current.play();
          } catch (e) {
            console.error("Error playing video:", e);
          }
        }
      } catch (err) {
        console.error("Webcam reconnection failed:", err);
        setError(err.message);
      }
    }, 500);
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsActive(false);
    }
    
    if (streamCheckIntervalRef.current) {
      clearInterval(streamCheckIntervalRef.current);
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
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
      
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
  }, [stream]);

  useEffect(() => {
    if (hasPermission && !streamCheckIntervalRef.current) {
      startStreamCheck();
    }
    
    return () => {
      if (streamCheckIntervalRef.current) {
        clearInterval(streamCheckIntervalRef.current);
      }
    };
  }, [hasPermission]);

  return {
    hasPermission,
    isActive,
    requestPermission,
    stopWebcam,
    videoRef,
    stream,
    error,
    reconnect: attemptReconnect
  };
};

export default useWebcam;