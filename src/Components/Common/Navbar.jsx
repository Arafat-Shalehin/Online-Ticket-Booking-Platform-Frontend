import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaBars, FaBusAlt, FaChevronDown, FaTimes } from "react-icons/fa";
import { Link, NavLink } from "react-router";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import useAuth from "../../Hooks/useAuth";
import useTheme from "../../Hooks/useTheme";
import useUserDetails from "../../QueryOptions/UserFunctions/getUserDetails";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

  const { user, logoutUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { userDetails } = useUserDetails();

  const navItems = useMemo(
    () => [
      { to: "/", label: "Home" },
      { to: "/all-tickets", label: "All Tickets" },
      { to: "/dashboard", label: "Dashboard" },
    ],
    []
  );

  const displayName = user?.displayName || userDetails?.name || "Account";
  const profileHref = userDetails?.role
    ? `/dashboard/${userDetails.role}/profile`
    : "/dashboard";

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  // Close dropdowns on outside click / Escape (premium + predictable)
  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!userMenuOpen) return;
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMenus();
    };

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [userMenuOpen]);

  const handleLogOut = () => {
    // Theme-aware styling for SweetAlert2 (until we replace with a unified Dialog)
    const isDark = theme === "dark";

    Swal.fire({
      title: "Log out?",
      text: "You will be signed out from TicketBari.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0d9488", // teal
      cancelButtonColor: "#dc2626", // red
      background: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#e2e8f0" : "#0f172a",
    }).then((result) => {
      if (!result.isConfirmed) return;

      logoutUser()
        .then(() => {
          toast.success("Logged out successfully.");
          closeMenus();
        })
        .catch((error) => {
          console.log(error);
          toast.error("Logout failed. Please try again later.");
        });
    });
  };

  const desktopLinkClass = ({ isActive }) =>
    [
      "inline-flex h-16 items-center border-b-2 px-1 text-sm font-medium transition-colors",
      isActive
        ? "border-primary text-foreground"
        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
    ].join(" ");

  const mobileLinkClass = ({ isActive }) =>
    [
      "block rounded-md px-3 py-2 text-base font-medium transition-colors",
      isActive
        ? "bg-muted text-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
    ].join(" ");

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <FaBusAlt className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold tracking-tight text-foreground">
              TicketBari
            </span>
          </Link>

          {/* Center: Desktop menu */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={desktopLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {/* Theme toggle always available */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            {!user ? (
              <>
                <Link
                  to="/auth/login"
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen((prev) => !prev);
                    setMobileMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-sm font-semibold text-foreground">
                      {displayName?.slice(0, 1)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <span className="max-w-[160px] truncate text-foreground">
                    {displayName}
                  </span>
                  <FaChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                    role="menu"
                  >
                    <Link
                      to={profileHref}
                      className="block rounded-sm px-3 py-2 text-sm hover:bg-muted focus:bg-muted"
                      onClick={closeMenus}
                      role="menuitem"
                    >
                      My Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogOut}
                      className="block w-full rounded-sm px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile: Hamburger */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);
                setUserMenuOpen(false);
              }}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Toggle main menu</span>
              {mobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-border">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={mobileLinkClass}
                onClick={closeMenus}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-border px-4 py-3">
            {/* Theme toggle (mobile) */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mb-3 inline-flex w-full items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {theme === "dark" ? "Light" : "Dark"} Mode
            </button>

            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {user?.photoURL ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.photoURL}
                      alt="User avatar"
                    />
                  ) : (
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-base font-semibold text-foreground">
                      {displayName?.slice(0, 1)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-foreground">
                      {displayName}
                    </div>
                  </div>
                </div>

                <Link
                  to={profileHref}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={closeMenus}
                >
                  My Profile
                </Link>

                <button
                  onClick={handleLogOut}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/auth/login"
                  className="block rounded-md border border-border bg-background px-3 py-2 text-center text-sm font-medium text-foreground hover:bg-muted"
                  onClick={closeMenus}
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:opacity-95"
                  onClick={closeMenus}
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
