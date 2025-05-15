import { useState, useEffect } from 'react';

const useFullscreen = () => {
  // Initialize with actual fullscreen state
  const getInitialFullscreenState = () => {
    return !!(
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  };

  const [isFullscreen, setIsFullscreen] = useState(getInitialFullscreenState());
  const [fullscreenError, setFullscreenError] = useState(null);

  // Update fullscreen state when component mounts and when fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;

      setIsFullscreen(!!fullscreenElement);
    };

    // Check initial state when component mounts
    handleFullscreenChange();

    // Set up event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // const enterFullscreen = async () => {
  //   try {
  //     // If already in fullscreen, don't try to enter again
  //     if (isFullscreen) {
  //       return true;
  //     }

  //     if (document.documentElement.requestFullscreen) {
  //       await document.documentElement.requestFullscreen();
  //     } else if (document.documentElement.mozRequestFullScreen) {
  //       await document.documentElement.mozRequestFullScreen();
  //     } else if (document.documentElement.webkitRequestFullscreen) {
  //       await document.documentElement.webkitRequestFullscreen();
  //     } else if (document.documentElement.msRequestFullscreen) {
  //       await document.documentElement.msRequestFullscreen();
  //     }
  //     setFullscreenError(null);
  //     // We don't need to set isFullscreen manually here - the event listener will handle it
  //     return true;
  //   } catch (error) {
  //     setFullscreenError(error.message);
  //     return false;
  //   }
  // };

 const enterFullscreen = () => {
    const element = document.documentElement;

    const requestFullScreen =
      element.requestFullscreen ||
      element.webkitRequestFullscreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullscreen;

    if (requestFullScreen) {
      return requestFullScreen.call(element).catch((error) => {
        console.error('Error attempting to enable fullscreen:', error);
      });
    }

    return Promise.resolve(); // Return resolved promise if fullscreen API is not available
  };

  const exitFullscreen = async () => {
    try {
      // If not in fullscreen, don't try to exit
      if (!isFullscreen) {
        return true;
      }

      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      // We don't need to set isFullscreen manually here - the event listener will handle it
      return true;
    } catch (error) {
      return false;
    }
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      return await enterFullscreen();
    } else {
      return await exitFullscreen();
    }
  };

  const isFullscreenAvailable = () => {
    return (
      document.fullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.msFullscreenEnabled
    );
  };

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    isFullscreenAvailable,
    fullscreenError
  };
};

export default useFullscreen;
