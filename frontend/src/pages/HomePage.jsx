import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, removeAuthToken, removeUserInfo } from '../utils/requestMethods';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Use useCallback to memoize the navigation function
  const handleLogout = useCallback(() => {
    // Clear authentication data
    removeAuthToken();
    removeUserInfo();
    console.log("User logged out");
    // Redirect to login with replace to avoid adding to history stack
    navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    
    // Get user information from local storage on component mount
    const checkUserAuth = async () => {
      try {
        const userInfo = getUserInfo();
        if (userInfo && isMounted) {
          setUser(userInfo);
          console.log("HomePage loaded with user:", userInfo);
        } else if (isMounted) {
          console.log("No user info found, redirecting to login");
          // Use replace to avoid adding to history stack
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error("Error checking user auth:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Add a small timeout to prevent rapid navigation
    const timeoutId = setTimeout(() => {
      checkUserAuth();
    }, 100);
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
     
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.firstName}!</h1>
            <p className="mt-2 text-gray-600">
              You've successfully logged into your account. This is your dashboard.
            </p>
            
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Dashboard card examples */}
              <div className="bg-indigo-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-indigo-800">Profile Information</h3>
                  <dl className="mt-2 text-sm text-gray-600">
                    <div className="mt-1">
                      <dt className="font-medium text-gray-500">Full Name</dt>
                      <dd>{user.firstName} {user.lastName}</dd>
                    </div>
                    <div className="mt-1">
                      <dt className="font-medium text-gray-500">Email</dt>
                      <dd>{user.email}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="bg-green-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-green-800">Account Status</h3>
                  <div className="mt-2 flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-full p-1">
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">Account Active</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-blue-800">Quick Actions</h3>
                  <div className="mt-5">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
