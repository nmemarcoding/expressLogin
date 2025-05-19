import { Link } from 'react-router-dom';
import { getUserInfo } from '../utils/requestMethods';
import { useState, useEffect, useCallback, memo } from 'react';

const Navbar = memo(({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = () => {
      const userInfo = getUserInfo();
      if (userInfo && isMounted) setUser(userInfo);
    };
    fetchUser();
    return () => { isMounted = false; };
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleLogoutClick = useCallback((e) => {
    e.preventDefault();
    const button = e.currentTarget;
    button.disabled = true;
    setTimeout(() => {
      onLogout?.();
      button.disabled = false;
    }, 300);
  }, [onLogout]);

  return (
    <nav className="bg-indigo-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand + Nav Links */}
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">
              MyApp
            </Link>
            <div className="hidden sm:flex sm:ml-10 space-x-6">
              <Link to="/" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <button className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                Profile
              </button>
              <button className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                Settings
              </button>
            </div>
          </div>

          {/* Desktop User Info + Logout */}
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-sm text-white">
              {user && `${user.firstName} ${user.lastName}`}
            </span>
            <button
              onClick={handleLogoutClick}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm rounded-md disabled:opacity-75 transition"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-indigo-600 px-4 pt-2 pb-4 space-y-1">
          <Link to="/" className="block text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium">
            Dashboard
          </Link>
          <button className="block w-full text-left text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium">
            Profile
          </button>
          <button className="block w-full text-left text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium">
            Settings
          </button>
          <div className="mt-2 flex items-center justify-between px-3">
            <span className="text-sm text-white">
              {user && `${user.firstName} ${user.lastName}`}
            </span>
            <button
              onClick={handleLogoutClick}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm rounded-md disabled:opacity-75 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
});

export default Navbar;
