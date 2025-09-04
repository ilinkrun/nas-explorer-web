import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import LoginPage from '@/pages/LoginPage';
import FilesPage from '@/pages/FilesPage';
import ConvertPage from '@/pages/ConvertPage';
import MainLayout from '@/components/layout/MainLayout';

function App() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/files" replace />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/files/*" element={<FilesPage />} />
        <Route path="/convert" element={<ConvertPage />} />
        <Route path="*" element={<Navigate to="/files" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;