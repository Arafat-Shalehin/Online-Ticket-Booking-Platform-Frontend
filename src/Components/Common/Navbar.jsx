import React, { useState } from "react";
import { FaBusAlt, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logoutUser } = useAuth();

  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be log out from this website!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log Out!",
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser()
          .then((result) => {
            console.log(result);
            toast.success("LogOut Successful.");
            setMobileMenuOpen(false);
            setUserMenuOpen(false);
          })
          .catch((error) => {
            console.log(error);
            toast.error("LogOut Failed. Please try again later.");
          });
      }
    });
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
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
            <a
              href="/all-tickets"
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
          </div>

          {/* Right: Desktop user / auth actions */}
          <div className="hidden md:flex md:items-center md:space-x-4 relative">
            {!user ? (
              <>
                <Link
                  to="/auth/login"
                  // onClick={handleLogin}
                  className="text-sm font-medium text-gray-700 hover:bg-gray-400/50 hover:text-white hover:font-bold transition-colors duration-150 border rounded px-4 py-1 cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  // onClick={handleRegister}
                  className="text-white px-4 py-1 border rounded bg-indigo-500 cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center rounded-full border border-transparent px-2 py-1 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <img
                    src={user?.photoURL}
                    alt="User avatar"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {user?.displayName}
                  </span>
                  <FaChevronDown className="ml-1 h-3 w-3 text-gray-500" />
                </button>

                {/* User dropdown (desktop) */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-40 
                    rounded-md bg-white py-1 shadow-lg 
                    ring-1 ring-black ring-opacity-5 text-center"
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
                      onClick={handleLogOut}
                      className="border rounded px-4 py-2 
                      text-left text-sm text-gray-700 
                      hover:bg-gray-50 mt-2"
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
            >
              Home
            </a>
            <a
              href="/tickets"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              All Tickets
            </a>
            <a
              href="/dashboard"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </a>
          </div>

          <div className="border-t border-gray-200 pt-4 pb-3">
            {user ? (
              <>
                <div className="flex items-center px-4">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={user?.photoURL}
                    alt="User avatar"
                  />
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user?.displayName}
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
                    onClick={handleLogOut}
                    className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-1 px-2">
                <Link
                  to="/auth/login"
                  className="block w-[20%] border rounded-md px-3 py-2 text-center text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="block w-[20%] rounded-md px-3 py-2 text-center text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
