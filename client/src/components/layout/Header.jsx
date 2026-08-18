import React, { useState, useEffect } from 'react';
import { Bell, Menu, UserCircle, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const notifRes = await api.get('/notifications?limit=100');
        const count = (notifRes.data || []).filter(n => !n.isRead).length;
        setUnreadCount(count);
      } catch (err) {
        console.error('Failed to fetch unread notifications count:', err);
      }
    };
    fetchUnread();

    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-wide">JALTRACK</h1>
              <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                isOnline ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300 animate-pulse'
              }`}>
                {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <span className="text-xs text-blue-200 hidden sm:block">Rural Drinking Water Management</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gov-light transition-colors relative">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full"></span>
            )}
          </button>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gov-light p-2 rounded-md transition-colors">
            <UserCircle size={24} />
            <div className="hidden sm:block text-sm">
              <p className="font-semibold leading-none">{user?.name || 'Guest User'}</p>
              <p className="text-blue-200 text-xs mt-1">{(user?.role || 'visitor').toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
