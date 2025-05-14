import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useStudentStore } from "../store/useStudentStore";

const PermissionPage = () => {
  const { setIsPermissionsAccepted } = useStudentStore();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState({
    camera: false,
    fullscreen: false,
    microphone: false,
    tabSwitching: false,
    browserWarning: false,
  });

  const handlePermissionChange = (permission) => {
    setPermissions({
      ...permissions,
      [permission]: !permissions[permission],
    });
  };

  const allPermissionsGranted = Object.values(permissions).every(Boolean);

  const handleContinue = () => {
    // navigate('/exam-prep');
    setIsPermissionsAccepted(true);
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      stream.getTracks().forEach((track) => track.stop());
      handlePermissionChange("camera");
    } catch (error) {
      console.error("Camera permission denied or error:", error);
    }
  };

  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement
        .requestFullscreen()
        .then(() => handlePermissionChange("fullscreen"))
        .catch((err) => console.error("Fullscreen error:", err));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const permissionIcons = {
    camera: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        ></path>
      </svg>
    ),
    fullscreen: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
        ></path>
      </svg>
    ),
    microphone: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        ></path>
      </svg>
    ),
    tabSwitching: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        ></path>
      </svg>
    ),
    browserWarning: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        ></path>
      </svg>
    ),
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="bg-gradient-to-r from-primary-700 to-primary p-6 text-center">
            <h1 className="text-3xl font-display font-bold text-white">
              Exam Security Setup
            </h1>
            <p className="mt-2 text-blue-100">
              Please grant the following permissions to proceed with your exam
            </p>
          </div>

          <div className="p-6 md:p-8">
            <motion.div
              className="space-y-4 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div
                variants={itemVariants}
                className={`p-4 border-2 rounded-xl flex items-start ${
                  permissions.camera
                    ? "border-success bg-success-light/20"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`mr-4 p-2 rounded-lg ${
                    permissions.camera
                      ? "text-success bg-success-light"
                      : "text-primary bg-blue-100"
                  }`}
                >
                  {permissionIcons.camera}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold">
                    Camera Access
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    We need access to your camera to monitor you during the exam
                    to prevent cheating.
                  </p>
                </div>
                <div className="ml-4 flex items-center">
                  {permissions.camera ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-success text-white rounded-full p-1"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </motion.div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary"
                      onClick={requestCameraPermission}
                    >
                      Allow
                    </motion.button>
                  )}
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className={`p-4 border-2 rounded-xl flex items-start ${
                  permissions.fullscreen
                    ? "border-success bg-success-light/20"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`mr-4 p-2 rounded-lg ${
                    permissions.fullscreen
                      ? "text-success bg-success-light"
                      : "text-primary bg-blue-100"
                  }`}
                >
                  {permissionIcons.fullscreen}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold">
                    Fullscreen Mode
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    The exam must be taken in fullscreen mode to prevent
                    accessing other resources.
                  </p>
                </div>
                <div className="ml-4 flex items-center">
                  {permissions.fullscreen ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-success text-white rounded-full p-1"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </motion.div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary"
                      onClick={requestFullscreen}
                    >
                      Allow
                    </motion.button>
                  )}
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className={`p-4 border-2 rounded-xl flex items-start ${
                  permissions.microphone
                    ? "border-success bg-success-light/20"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`mr-4 p-2 rounded-lg ${
                    permissions.microphone
                      ? "text-success bg-success-light"
                      : "text-primary bg-blue-100"
                  }`}
                >
                  {permissionIcons.microphone}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold">
                    Microphone Access
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    We need access to your microphone to detect any suspicious
                    sounds or conversations.
                  </p>
                </div>
                <div className="ml-4 flex items-center">
                  {permissions.microphone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-success text-white rounded-full p-1"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </motion.div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary"
                      onClick={() => handlePermissionChange("microphone")}
                    >
                      Allow
                    </motion.button>
                  )}
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className={`p-4 border-2 rounded-xl flex items-start ${
                  permissions.tabSwitching
                    ? "border-success bg-success-light/20"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`mr-4 p-2 rounded-lg ${
                    permissions.tabSwitching
                      ? "text-success bg-success-light"
                      : "text-primary bg-blue-100"
                  }`}
                >
                  {permissionIcons.tabSwitching}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold">
                    Tab Switching Detection
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    We will detect if you switch to another tab or application
                    during the exam.
                  </p>
                </div>
                <div className="ml-4 flex items-center">
                  {permissions.tabSwitching ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-success text-white rounded-full p-1"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </motion.div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary"
                      onClick={() => handlePermissionChange("tabSwitching")}
                    >
                      Allow
                    </motion.button>
                  )}
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className={`p-4 border-2 rounded-xl flex items-start ${
                  permissions.browserWarning
                    ? "border-success bg-success-light/20"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`mr-4 p-2 rounded-lg ${
                    permissions.browserWarning
                      ? "text-success bg-success-light"
                      : "text-primary bg-blue-100"
                  }`}
                >
                  {permissionIcons.browserWarning}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold">
                    Browser Warning
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    Any suspicious behavior will be flagged and may result in
                    disqualification.
                  </p>
                </div>
                <div className="ml-4 flex items-center">
                  {permissions.browserWarning ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-success text-white rounded-full p-1"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </motion.div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary"
                      onClick={() => handlePermissionChange("browserWarning")}
                    >
                      Allow
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {!allPermissionsGranted && (
                <motion.div
                  className="bg-blue-50 border-l-4 border-primary p-4 rounded-lg mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="text-sm text-primary-800">
                    <span className="font-medium">Important:</span> All
                    permissions are required to ensure exam integrity. Please
                    grant all permissions to continue.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-center">
              <motion.button
                onClick={handleContinue}
                disabled={!allPermissionsGranted}
                className={`btn-primary px-8 py-3 flex items-center gap-2 ${
                  !allPermissionsGranted ? "opacity-60 cursor-not-allowed" : ""
                }`}
                whileHover={allPermissionsGranted ? { scale: 1.03 } : {}}
                whileTap={allPermissionsGranted ? { scale: 0.98 } : {}}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span>Continue to Exam</span>
                {allPermissionsGranted && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    ></path>
                  </svg>
                )}
              </motion.button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 border-t flex justify-center">
            <div className="flex space-x-2">
              <div className="h-2 w-8 rounded-full bg-primary"></div>
              <div className="h-2 w-8 rounded-full bg-gray-300"></div>
              <div className="h-2 w-8 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PermissionPage;
