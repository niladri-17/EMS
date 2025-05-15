import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
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
import { useStudentStore } from "./store/useStudentStore";
import { useAdminStore } from "./store/useAdminStore";
import { Toaster } from "react-hot-toast";

// Admin protection component
const AdminAuthProtection = () => {
  const { adminAuthUser } = useAdminStore();
  return adminAuthUser ? <Outlet /> : <Navigate to="/" replace />;
};

// Student protection component
const StudentAuthProtection = () => {
  const { studentAuthUser } = useStudentStore();
  return studentAuthUser ? <Outlet /> : <Navigate to="/" replace />;
};

// Permissions check component - renders appropriate content or redirects
const PermissionsCheck = () => {
  const { isPermissionsAccepted, isExamPrepared } = useStudentStore();

  if (!isPermissionsAccepted) {
    return (
      <MainLayout>
        <PermissionPage />
      </MainLayout>
    );
  }

  // Permissions accepted, but check if we should go to prep or exam
  if (isExamPrepared) {
    return <Navigate to="/exam" replace />;
  } else {
    return <Navigate to="/exam-prep" replace />;
  }
};

// Exam prep check component - renders prep page or redirects
const ExamPrepCheck = () => {
  const { isExamPrepared } = useStudentStore();

  if (!isExamPrepared) {
    return (
      <MainLayout>
        <ExamPreparationPage />
      </MainLayout>
    );
  }

  return <Navigate to="/exam" replace />;
};

// AnimatePresenceWrapper component to handle location-based animations
const AnimatedRoutes = () => {
  const location = useLocation();
  const { studentAuthUser, isPermissionsAccepted, isExamPrepared } = useStudentStore();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected admin routes */}
        {/* <Route element={<AdminAuthProtection />}> */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/exams" element={<ExamsPage />} />
          <Route path="/admin/exams/create" element={<CreateExamPage />} />
          <Route path="/admin/questions" element={<QuestionsPage />} />
          <Route path="/admin/students" element={<StudentsPage />} />
          <Route path="/admin/results" element={<ResultsPage />} />
        {/* </Route> */}

        {/* Student exam routes */}
        {/* Exam ID route - entry point for exam takers */}
        <Route
          path="/"
          element={
            !studentAuthUser ? (
              <MainLayout>
                <LoginPage />
              </MainLayout>
            ) : // Redirect based on progression
            isExamPrepared ? (
              <Navigate to="/exam" replace />
            ) : isPermissionsAccepted ? (
              <Navigate to="/exam-prep" replace />
            ) : (
              <Navigate to="/permissions" replace />
            )
          }
        />

        {/* Protected student routes - require student authentication */}
        <Route element={<StudentAuthProtection />}>
          {/* Permissions page */}
          <Route path="/permissions" element={<PermissionsCheck />} />

          {/* Exam prep page - requires permissions */}
          <Route path="/exam-prep" element={
            !isPermissionsAccepted ? (
              <Navigate to="/permissions" replace />
            ) : (
              <ExamPrepCheck />
            )
          } />

          {/* Exam page - requires permissions and prep */}
          <Route path="/exam" element={
            !isPermissionsAccepted ? (
              <Navigate to="/permissions" replace />
            ) : !isExamPrepared ? (
              <Navigate to="/exam-prep" replace />
            ) : (
              <MainLayout>
                <ExamPage />
              </MainLayout>
            )
          } />
        </Route>

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ExamProvider>
      <BrowserRouter>
        <AnimatedRoutes />
        <Toaster />
      </BrowserRouter>
    </ExamProvider>
  );
}

export default App;
