import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ExamsPage from "./pages/admin/ExamsPage";
import CreateExamPage from "./pages/admin/CreateExamPage";
import QuestionsPage from "./pages/admin/QuestionsPage";
import StudentsPage from "./pages/admin/StudentsPage";
import ResultsPage from "./pages/admin/ResultsPage";
import PermissionPage from "./pages/PermissionPage";
import ExamPreparationPage from "./pages/ExamPreparationPage";
import ExamPage from "./pages/ExamPage";
import MainLayout from "./layouts/MainLayout";
import { ExamProvider } from "./context/ExamContext";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { authUser, permissionsAccepted } = useAuthStore();

  return (
    <ExamProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/:examId"
              element={
                !authUser ? (
                  <MainLayout>
                    <LoginPage />
                  </MainLayout>
                ) : (
                  <Navigate to="/permissions" />
                )
              }
            />
            {/* Permissions page */}
            <Route
              path="/permissions"
              element={
                !permissionsAccepted && authUser ? (
                  <MainLayout>
                    <PermissionPage />
                  </MainLayout>
                ) : (
                  <Navigate to={permissionsAccepted ? "/exam-prep" : "/"} /> // Redirect to exam prep if permissions accepted, else to home page
                )
              }
            />

            {/* Exam preparation route, only accessible after permissions are accepted */}
            <Route
              path="/exam-prep"
              element={
                permissionsAccepted ? (
                  <MainLayout>
                    <ExamPreparationPage />
                  </MainLayout>
                ) : (
                  <Navigate to="/permissions" /> // If permissions not accepted, redirect to permissions page
                )
              }
            />

            {/* Exam route */}
            <Route
              path="/exam"
              element={
                permissionsAccepted ? (
                  <MainLayout>
                    <ExamPage />
                  </MainLayout>
                ) : (
                  <Navigate to="/permissions" /> // Redirect to permissions if not accepted
                )
              }
            />

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/exams" element={<ExamsPage />} />
            <Route path="/admin/exams/create" element={<CreateExamPage />} />
            <Route path="/admin/questions" element={<QuestionsPage />} />
            <Route path="/admin/students" element={<StudentsPage />} />
            <Route path="/admin/results" element={<ResultsPage />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </ExamProvider>
  );
}

export default App;
