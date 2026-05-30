// src/App.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { JobProvider } from './context/JobContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PageLoader from './components/PageLoader.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import NewJobAlert from './components/NewJobAlert.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const PostJobPage = lazy(() => import('./pages/PostJobPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

function AppContent() {
  return (
    <ErrorBoundary>
      <Navbar />
      <NewJobAlert />
      {/* ↑ shows banner when new job posted in real-time */}

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          <Route path="/post-job" element={
            <ProtectedRoute allowedRoles={['employer', 'admin']}>
              <PostJobPage />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <ScrollToTop />
    </ErrorBoundary>
  );
}

function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <SocketProvider>
          {/* ↑ SocketProvider inside so it can access auth state */}
          <AppContent />
        </SocketProvider>
      </JobProvider>
    </AuthProvider>
  );
}

export default App;