import { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useStudentStore } from "../store/useStudentStore";
import { useEffect } from "react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    emailId: "",
    examCode: "",
  });

  // Move useParams() to the top level of the component
  const { examId: urlExamId } = useParams();

  const { examId, login, isLoggingIn, setExamId } = useStudentStore();
  console.log(examId);

  useEffect(() => {
    if (!examId && urlExamId) {
      setExamId(urlExamId);
    }
  }, [examId, urlExamId, setExamId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await login(examId, formData);

    } catch (error) {
      console.error("Unexpected error during login:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-white text-2xl font-bold mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            SE
          </motion.div>
          <h1 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-700">
            SecureExam
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-8 backdrop-blur-sm bg-white/90">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-semibold text-gray-800">
              Welcome John
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Ready to take your exam?
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-primary rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              We've sent a exam code to your email address. Please check your
              inbox and enter the code below to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Id
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email id"
                  value={formData.emailId}
                  onChange={(e) =>
                    setFormData({ ...formData, emailId: e.target.value })
                  }
                  required
                  className="input-field pl-10"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Exam Code
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your access code"
                  value={formData.examCode}
                  onChange={(e) =>
                    setFormData({ ...formData, examCode: e.target.value })
                  }
                  required
                  className="input-field pl-10"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn-primary w-full py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {isLoggingIn ? "Logging in..." : "Proceed to Exam"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/admin/login"
              className="text-sm text-primary hover:text-primary-700 font-medium"
            >
              Admin Login →
            </Link>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          Need help? Contact{" "}
          <a
            href="#"
            className="text-primary hover:text-primary-700 font-medium"
          >
            exam@support.com
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
