import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiLayout, FiSettings, FiSend, FiBarChart2 } from 'react-icons/fi';

const Nav = () => {
  const location = useLocation();
  const formNumber = localStorage.getItem('formNumber');

  const navItems = [
    { path: `/build/${formNumber}`, label: 'Build', icon: FiLayout },
    { path: `/settings/${formNumber}`, label: 'Settings', icon: FiSettings },
    { path: `/publish/${formNumber}`, label: 'Publish', icon: FiSend },
    { path: `/responses/${formNumber}`, label: 'Responses', icon: FiBarChart2 },
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Back to Dashboard */}
          <Link
            to="/"
            onClick={() => localStorage.clear()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform duration-200" size={18} />
            <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
          </Link>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-gray-800/80 rounded-xl p-1 border border-gray-700/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Spacer */}
          <div className="w-24"></div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;