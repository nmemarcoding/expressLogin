import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { getAuthToken, removeAuthToken, removeUserInfo } from './utils/requestMethods';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import './App.css';

// Loading component
const LoadingScreen = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Main App Content with navigation
const AppContent = () => {
  const navigate = useNavigate();
  
  const handleLogout = useCallback(() => {
    removeAuthToken();
    removeUserInfo();
    navigate('/login', { replace: true });
  }, [navigate]);
  
  // Protected Route component with Navbar integration
  const ProtectedRoute = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
      const token = getAuthToken();
      setIsAuth(!!token);
      setIsChecking(false);
    }, []);

    if (isChecking) {
      return <LoadingScreen />;
    }

    if (!isAuth) {
      return <Navigate to="/login" />;
    }

    return (
      <>
        <Navbar onLogout={handleLogout} />
        <div className="pt-14 md:pt-16">
          {children}
        </div>
      </>
    );
  };

  // Auth Route component (for login/register)
  const AuthRoute = ({ children }) => {
    const isAuthenticated = !!getAuthToken();
    
    if (isAuthenticated) {
      return <Navigate to="/" />;
    }
    
    return children;
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile/:username"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/find-friends"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/login" 
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } 
      />
      
      <Route 
        path="/signup" 
        element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
