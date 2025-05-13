import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import PermissionPage from './pages/PermissionPage';
import ExamPreparationPage from './pages/ExamPreparationPage';
import ExamPage from './pages/ExamPage';
import MainLayout from './layouts/MainLayout';
import { ExamProvider } from './context/ExamContext';

function App() {
  return (
    <ExamProvider>
      <BrowserRouter>
        <MainLayout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/permissions" element={<PermissionPage />} />
              <Route path="/exam-prep" element={<ExamPreparationPage />} />
              <Route path="/exam" element={<ExamPage />} />
            </Routes>
          </AnimatePresence>
        </MainLayout>
      </BrowserRouter>
    </ExamProvider>
  );
}

export default App;