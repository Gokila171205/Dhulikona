import React from 'react';
import { Bell, Menu, UserCircle } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-gov-blue text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gov-light md:hidden focus:outline-none focus:ring-2 focus:ring-white"
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-wide">JALTRACK</h1>
            <span className="text-xs text-blue-200 hidden sm:block">Rural Drinking Water Management</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gov-light transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full"></span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gov-light p-2 rounded-md transition-colors">
            <UserCircle size={24} />
            <div className="hidden sm:block text-sm">
              <p className="font-semibold leading-none">Admin User</p>
              <p className="text-blue-200 text-xs">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
