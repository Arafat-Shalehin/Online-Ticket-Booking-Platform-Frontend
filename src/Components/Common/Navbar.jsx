import React, { useState } from "react";
import { FaBusAlt, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  // Simulated auth state – replace with your real auth logic
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const user = {
    name: "John Doe",
    avatarUrl: "https://i.pravatar.cc/150?img=3", // replace with your avatar source
  };

  const handleLogin = () => {
    // navigate to login page or open modal
    console.log("Login clicked");
  };

  const handleRegister = () => {
    // navigate to register page or open modal
    console.log("Register clicked");
  };

  const handleLogout = () => {
    // perform logout logic
    console.log("Logout clicked");
    setIsAuthenticated(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <FaBusAlt className="mr-2 h-7 w-7 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">
                TicketBari
              </span>
            </a>
          </div>

          {/* Center: Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <a
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              Home
            </a>

            {isAuthenticated && (
              <>
                <a
                  href="/tickets"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  All Tickets
                </a>
                <a
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Dashboard
                </a>
              </>
            )}
          </div>

          {/* Right: Desktop user / auth actions */}
          <div className="hidden md:flex md:items-center md:space-x-4 relative">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={handleLogin}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Register
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center rounded-full border border-transparent px-2 py-1 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <img
                    src={user.avatarUrl}
                    alt="User avatar"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <FaChevronDown className="ml-1 h-3 w-3 text-gray-500" />
                </button>

                {/* User dropdown (desktop) */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-40 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={closeMenus}
                    >
                      My Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile: Hamburger button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <a
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={closeMenus}
            >
              Home
            </a>

            {isAuthenticated && (
              <>
                <a
                  href="/tickets"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={closeMenus}
                >
                  All Tickets
                </a>
                <a
                  href="/dashboard"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={closeMenus}
                >
                  Dashboard
                </a>
              </>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 pb-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-4">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={user.avatarUrl}
                    alt="User avatar"
                  />
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.name}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <a
                    href="/profile"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={closeMenus}
                  >
                    My Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-1 px-2">
                <button
                  onClick={handleLogin}
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;