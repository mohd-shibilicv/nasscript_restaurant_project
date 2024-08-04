import {
  LayoutDashboard,
  Sandwich,
  ShoppingCart,
  SlidersVertical,
} from "lucide-react";
import React from "react";
import { useLocation, Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-yellow-400" : "hover:bg-gray-100";
  };

  return (
    <div className="w-full md:w-64 bg-white p-4 h-screen border-r border-gray-500">
      <Link to="/">
        <div className="text-red-500 text-2xl font-bold mb-8">Logo</div>
      </Link>
      <nav>
        <ul className="space-y-2">
          <Link
            to="/"
            className={`flex items-center space-x-2 p-2 rounded ${isActive(
              "/"
            )}`}
          >
            <li className="flex items-center space-x-2">
              <LayoutDashboard />
              <span>Dashboard</span>
            </li>
          </Link>
          <Link
            to="/dishes"
            className={`flex items-center space-x-2 p-2 rounded ${isActive(
              "/dishes"
            )}`}
          >
            <li className="flex items-center space-x-2">
              <Sandwich className="w-6 h-6" />
              <span>Dishes</span>
            </li>
          </Link>
          <Link
            to="/orders"
            className={`flex items-center space-x-2 p-2 rounded ${isActive(
              "/orders"
            )}`}
          >
            <li className="flex items-center space-x-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <span>Orders</span>
            </li>
          </Link>
          <Link
            to="/bills"
            className={`flex items-center space-x-2 p-2 rounded ${isActive(
              "/bills"
            )}`}
          >
            <li className="flex items-center space-x-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span>Bills</span>
            </li>
          </Link>
          <Link
            to="/settings"
            className={`flex items-center space-x-2 p-2 rounded ${isActive(
              "/settings"
            )}`}
          >
            <li className="flex items-center space-x-2">
              <SlidersVertical />
              <span>Settings</span>
            </li>
          </Link>
        </ul>
      </nav>
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">Other</h3>
        <ul>
          <Link
            to="/notifications"
            className={`flex items-center space-x-2 p-2 rounded ${isActive(
              "/notifications"
            )}`}
          >
            <li className="flex items-center space-x-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span>Notifications</span>
            </li>
          </Link>
        </ul>
      </div>
      <a href="https://nasscript.com" target="_blank" className="absolute bottom-0 left-20 flex items-center">
        <p className="text-gray-600 text-sm">Powered by</p>
        <img
        src="/images/nasscript_company_logo.jpg"
        alt="logo"
        width={32}
        height={32}
      />
      </a>
    </div>
  );
};

export default Sidebar;
