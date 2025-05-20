import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuthToken } from './hooks/requestMethods';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './App.css';

// Loading component
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen w-full bg-white bg-opacity-90">
    <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin mb-4"></div>
    <p className="text-gray-700">Loading...</p>
  </div>
);

// Protected Route component
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

    return children;
};

// Auth Route component (for login/register)
const AuthRoute = ({ children }) => {
    const isAuthenticated = !!getAuthToken();
    
    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }
    
    return children;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="pt-16"> {/* Add padding to prevent content from being hidden under navbar */}
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
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
                        <Route 
                            path="/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } 
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
