import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import { CiBookmarkCheck } from "react-icons/ci";
import { GrTransaction } from "react-icons/gr";
import useAuthProfile from "../Hooks/useAuthProfile";
import {
  FaRegUserCircle,
  FaTicketAlt,
  FaUsersCog,
  FaBullhorn,
  FaChartLine,
} from "react-icons/fa";
import { MdAddCircleOutline, MdOutlineRequestPage } from "react-icons/md";
import { RiTicket2Line } from "react-icons/ri";

const DashboardLayout = () => {
  const { isAdmin, isVendor, isUser } = useAuthProfile();
  // console.log({ isAdmin, isVendor, isUser });
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Navbar */}
          <nav className="navbar w-full bg-base-300">
            <label
              htmlFor="my-drawer-4"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              {/* Sidebar toggle icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
                className="my-1.5 inline-block size-4"
              >
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                <path d="M9 4v16"></path>
                <path d="M14 10l2 2l-2 2"></path>
              </svg>
            </label>
            <div className="px-4">TicketBari Dashboard</div>
          </nav>
          {/* Page content here */}
          <Outlet></Outlet>
        </div>

        <div className="drawer-side is-drawer-close:overflow-visible">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
            {/* Sidebar content here */}
            <ul className="menu w-full grow">
              {/* List item */}
              <li>
                {/* Home */}
                <Link
                  to="/"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip="Home"
                >
                  {/* Home icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                    className="my-1.5 inline-block size-4"
                  >
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  <span className="is-drawer-close:hidden">Home</span>
                </Link>
              </li>

              {/* Our Dashboard Links */}
              {isUser && (
                <>
                  <li>
                    {/* User Profile */}
                    <NavLink
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="My Profile"
                      to="/dashboard/user/profile"
                    >
                      <FaRegUserCircle />
                      <span className="is-drawer-close:hidden">My Profile</span>
                    </NavLink>
                  </li>
                  <li>
                    {/* My Booked Tickets  */}
                    <NavLink
                      className="is-drawer-close:tooltip
                  is-drawer-close:tooltip-right"
                      data-tip="My Booked Tickets"
                      to="/dashboard/user/my-booked-tickets"
                    >
                      <CiBookmarkCheck />
                      <span className="is-drawer-close:hidden">
                        My Booked Tickets
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    {/* Transaction History   */}
                    <NavLink
                      className="is-drawer-close:tooltip
                  is-drawer-close:tooltip-right"
                      data-tip="Transaction History "
                      to="/dashboard/user/transaction-history"
                    >
                      <GrTransaction />
                      <span className="is-drawer-close:hidden">
                        Transaction History{" "}
                      </span>
                    </NavLink>
                  </li>
                </>
              )}
              {isVendor && (
                <>
                  <li>
                    {/* Vendor Profile */}
                    <NavLink
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Vendor Profile"
                      to="/dashboard/vendor/profile"
                    >
                      <FaRegUserCircle />
                      <span className="is-drawer-close:hidden">
                        Vendor Profile
                      </span>
                    </NavLink>
                  </li>

                  <li>
                    {/* Add Ticket */}
                    <NavLink
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Add Ticket"
                      to="/dashboard/vendor/add-ticket"
                    >
                      <MdAddCircleOutline />
                      <span className="is-drawer-close:hidden">Add Ticket</span>
                    </NavLink>
                  </li>

                  <li>
                    {/* My Added Tickets */}
                    <NavLink
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="My Added Tickets"
                      to="/dashboard/vendor/my-added-tickets"
                    >
                      <RiTicket2Line />
                      <span className="is-drawer-close:hidden">
                        My Added Tickets
                      </span>
                    </NavLink>
                  </li>

                  <li>
                    {/* Requested Bookings */}
                    <NavLink
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Requested Bookings"
                      to="/dashboard/vendor/requested-bookings"
                    >
                      <MdOutlineRequestPage />
                      <span className="is-drawer-close:hidden">
                        Requested Bookings
                      </span>
                    </NavLink>
                  </li>

                  <li>
                    {/* Revenue Overview */}
                    <NavLink
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Revenue Overview"
                      to="/dashboard/vendor/revenue-overview"
                    >
                      <FaChartLine />
                      <span className="is-drawer-close:hidden">
                        Revenue Overview
                      </span>
                    </NavLink>
                  </li>
                </>
              )}
              {isAdmin && (
                <>
                  <li>
                    {/* Admin Profile */}
                    <NavLink
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Admin Profile"
                      to="/dashboard/admin/profile"
                    >
                      <FaRegUserCircle />
                      <span className="is-drawer-close:hidden">
                        Admin Profile
                      </span>
                    </NavLink>
                  </li>

                  <li>
                    {/* Manage Tickets */}
                    <NavLink
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Manage Tickets"
                      to="/dashboard/admin/manage-tickets"
                    >
                      <FaTicketAlt />
                      <span className="is-drawer-close:hidden">
                        Manage Tickets
                      </span>
                    </NavLink>
                  </li>

                  <li>
                    {/* Manage Users */}
                    <NavLink
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Manage Users"
                      to="/dashboard/admin/manage-users"
                    >
                      <FaUsersCog />
                      <span className="is-drawer-close:hidden">
                        Manage Users
                      </span>
                    </NavLink>
                  </li>

                  <li>
                    {/* Advertise Tickets */}
                    <NavLink
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Advertise Tickets"
                      to="/dashboard/admin/advertise-tickets"
                    >
                      <FaBullhorn />
                      <span className="is-drawer-close:hidden">
                        Advertise Tickets
                      </span>
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
