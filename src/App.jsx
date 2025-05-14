import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ExamsPage from './pages/admin/ExamsPage';
import CreateExamPage from './pages/admin/CreateExamPage';
import QuestionsPage from './pages/admin/QuestionsPage';
import StudentsPage from './pages/admin/StudentsPage';
import ResultsPage from './pages/admin/ResultsPage';
import PermissionPage from './pages/PermissionPage';
import ExamPreparationPage from './pages/ExamPreparationPage';
import ExamPage from './pages/ExamPage';
import MainLayout from './layouts/MainLayout';
import { ExamProvider, useExam } from './context/ExamContext';
import Toast from './components/Toast';
import AntiCheatSystem from './AntiCheatSystem';

const ToastNotification = () => {
  const { examState, updateExamState } = useExam();
  const { toast } = examState;

  if (!toast.show) return null;
  
  const handleClose = () => {
    updateExamState({
      toast: { ...toast, show: false }
    });
  };

  return (
    <Toast message={toast.message} type={toast.type} onClose={handleClose} />
  );
};

function App() {
  return (
    <ExamProvider>
      <BrowserRouter>
        <ToastNotification />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <MainLayout>
                <LoginPage />
              </MainLayout>
            } />
            <Route path="/permissions" element={
              <MainLayout>
                <PermissionPage />
              </MainLayout>
            } />
            <Route path="/exam-prep" element={
              <MainLayout>
                <ExamPreparationPage />
              </MainLayout>
            } />
            <Route path="/exam" element={
              <MainLayout>
                <ExamPage />
              </MainLayout>
            } />
            
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