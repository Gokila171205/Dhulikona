import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { 
  Bell, CheckCircle, Search, RefreshCw, AlertTriangle, Eye, Trash2, ShieldAlert,
  Info
} from 'lucide-react';
import api from '../../services/api';

const typeOptions = ['info', 'warning', 'success'];
const statusOptions = ['Read', 'Unread'];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isMarkAllModalOpen, setIsMarkAllModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedNotification, setSelectedNotification] = useState(null);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const day = d.getDate().toString().padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return `${day} ${month} ${year} · ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    } catch (e) {
      return '';
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const notifRes = await api.get('/notifications?limit=100');
      const mapped = (notifRes.data || []).map(n => ({
        id: n._id.toString(),
        title: n.title,
        message: n.message,
        type: n.type || 'info',
        status: n.isRead ? 'Read' : 'Unread',
        createdAt: n.createdAt
      }));
      setNotifications(mapped);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter Logic
  const filteredNotifications = notifications.filter(n => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      n.title.toLowerCase().includes(searchLower) || 
      n.id.toLowerCase().includes(searchLower) ||
      n.message.toLowerCase().includes(searchLower);
    
    const matchesType = typeFilter ? n.type === typeFilter : true;
    const matchesStatus = statusFilter ? n.status === statusFilter : true;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate Summaries
  const totalNotifications = notifications.length;
  const unreadCount = notifications.filter(n => n.status === 'Unread').length;
  const readCount = notifications.filter(n => n.status === 'Read').length;

  // Actions
  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
  };

  const handleView = (notification) => {
    setSelectedNotification(notification);
    setIsViewModalOpen(true);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
      
      // Also update selected if it's currently open
      if (selectedNotification && selectedNotification.id === id) {
        setSelectedNotification({ ...selectedNotification, status: 'Read' });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark notification as read.');
    }
  };

  const handleMarkAllAsReadConfirm = async () => {
    try {
      await api.patch('/notifications/read-all');
      setIsMarkAllModalOpen(false);
      fetchNotifications();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark all notifications as read.');
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedNotification) {
      setNotifications(notifications.filter(n => n.id !== selectedNotification.id));
      setIsDeleteModalOpen(false);
    }
  };

  const confirmDelete = (notification) => {
    setSelectedNotification(notification);
    setIsDeleteModalOpen(true);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'warning': return <AlertTriangle size={14} className="text-red-500" />;
      case 'success': return <CheckCircle size={14} className="text-green-500" />;
      case 'info': return <Info size={14} className="text-blue-500" />;
      default: return <Bell size={14} className="text-gray-500" />;
    }
  };
  const columns = [
    { 
      header: 'Date', 
      render: (row) => (
        <span className="text-xs text-gray-500">{formatDateTime(row.createdAt)}</span>
      )
    },
    { 
      header: 'Title', 
      render: (row) => (
        <span className={`font-semibold ${row.status === 'Unread' ? 'text-gray-950 font-bold' : 'text-gray-600'}`}>{row.title}</span>
      )
    },
    { 
      header: 'Message', 
      render: (row) => (
        <p className="text-xs text-gray-500 truncate max-w-xs md:max-w-md">{row.message}</p>
      )
    },
    { 
      header: 'Type', 
      render: (row) => (
        <div className="flex items-center gap-1 text-sm font-medium text-gray-700 capitalize">
          {getTypeIcon(row.type)} {row.type}
        </div>
      )
    },
    { 
      header: 'Read/Unread', 
      render: (row) => (
        <span className={`text-xs font-bold uppercase ${row.status === 'Unread' ? 'text-gov-blue font-bold' : 'text-gray-400'}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-3">
          <button onClick={() => handleView(row)} className="text-gray-500 hover:text-gov-blue" title="View Details">
            <Eye size={18} />
          </button>
          {row.status === 'Unread' && (
            <button onClick={() => handleMarkAsRead(row.id)} className="text-gray-500 hover:text-green-600" title="Mark as Read">
              <CheckCircle size={18} />
            </button>
          )}
          <button onClick={() => confirmDelete(row)} className="text-gray-500 hover:text-red-600" title="Delete">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
        <span className="ml-2 text-gray-600">Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bell size={24} className="text-gov-blue" /> Notifications
          </h2>
          <p className="text-gray-500 text-sm mt-1">Monitor important system alerts and service notifications requiring administrative attention.</p>
        </div>
        <Button 
          onClick={() => setIsMarkAllModalOpen(true)} 
          variant="outline"
          disabled={unreadCount === 0}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <CheckCircle size={16} /> Mark All as Read
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-4 bg-gray-50 border-gray-200 text-center flex flex-col justify-center items-center">
          <h3 className="text-2xl font-bold text-gray-800">{totalNotifications}</h3>
          <p className="text-[10px] font-semibold uppercase text-gray-500 mt-1">Total</p>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-200 text-center flex flex-col justify-center items-center">
          <h3 className="text-2xl font-bold text-blue-800">{unreadCount}</h3>
          <p className="text-[10px] font-semibold uppercase text-blue-600 mt-1">Unread</p>
        </Card>
        <Card className="p-4 bg-red-50 border-red-200 text-center flex flex-col justify-center items-center shadow-sm">
          <h3 className="text-lg font-bold text-red-700">Not available</h3>
          <p className="text-[10px] font-semibold uppercase text-red-600 mt-1">Critical (Unread)</p>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-200 text-center flex flex-col justify-center items-center shadow-sm">
          <h3 className="text-lg font-bold text-amber-700">Not available</h3>
          <p className="text-[10px] font-semibold uppercase text-amber-600 mt-1">High (Unread)</p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200 text-center flex flex-col justify-center items-center">
          <h3 className="text-2xl font-bold text-green-700">{readCount}</h3>
          <p className="text-[10px] font-semibold uppercase text-green-600 mt-1">Resolved / Read</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Needs Attention Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 bg-red-50/30 border-red-100 flex flex-col h-full">
            <h3 className="text-[13px] font-bold text-red-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-red-100 pb-2">
              <AlertTriangle size={16} /> Needs Attention
            </h3>
            
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1">
              {notifications.filter(n => n.status === 'Unread' && n.type === 'warning').length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle size={32} className="text-green-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-500">You're all caught up!</p>
                  <p className="text-xs text-gray-400 mt-1">No warnings requiring attention.</p>
                </div>
              ) : (
                notifications
                  .filter(n => n.status === 'Unread' && n.type === 'warning')
                  .map(n => (
                    <div 
                      key={n.id} 
                      className="p-3 rounded border shadow-sm hover:shadow cursor-pointer transition-shadow bg-white border-red-200 border-l-4 border-l-red-500"
                      onClick={() => handleView(n)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{n.type}</span>
                        <span className="text-[10px] font-semibold text-gray-400">
                          {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1">{n.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                    </div>
                  ))
              )}
            </div>
          </Card>
        </div>

        {/* Main Interface */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <Input 
                  placeholder="Search alerts..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                options={[{ label: 'All Types', value: '' }, ...typeOptions.map(t => ({ label: t, value: t }))]}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              />
              
              <Select
                options={[{ label: 'All Statuses', value: '' }, ...statusOptions.map(s => ({ label: s, value: s }))]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
            
            {(searchTerm || typeFilter || statusFilter) && (
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handleClearFilters}
                  className="text-sm text-gov-blue hover:underline flex items-center gap-1 font-medium"
                >
                  <RefreshCw size={14} /> Clear all filters
                </button>
              </div>
            )}
          </Card>

          {/* Table */}
          <Card className="overflow-hidden">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <Bell size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No notifications found</h3>
                <p className="text-gray-500 text-sm mt-1">No notifications match your current filters.</p>
              </div>
            ) : (
              <Table columns={columns} data={filteredNotifications} keyExtractor={row => row.id} />
            )}
          </Card>
        </div>
      </div>

      {/* View Details Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        title="Notification Details"
        className="max-w-2xl"
      >
        {selectedNotification && (
          <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex gap-3 items-start">
                <div className="mt-1 p-2 rounded-full bg-blue-100 text-blue-600">
                  {getTypeIcon(selectedNotification.type)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{selectedNotification.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className={`font-bold uppercase text-[10px] ${selectedNotification.status === 'Unread' ? 'text-gov-blue' : 'text-gray-400'}`}>
                      {selectedNotification.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="text-gray-800 text-sm leading-relaxed">{selectedNotification.message}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm border-t border-gray-100 pt-4">
              <div className="flex flex-col border-b border-dashed pb-1">
                <span className="text-gray-500 flex items-center gap-1 mb-1"><Info size={14} /> Notification ID</span>
                <span className="font-medium text-gray-900">{selectedNotification.id}</span>
              </div>
              <div className="flex flex-col border-b border-dashed pb-1">
                <span className="text-gray-500 flex items-center gap-1 mb-1"><Info size={14} /> Type</span>
                <span className="font-medium text-gray-900 capitalize">{selectedNotification.type}</span>
              </div>
              <div className="flex flex-col border-b border-dashed pb-1">
                <span className="text-gray-500 flex items-center gap-1 mb-1"><Info size={14} /> Generated On</span>
                <span className="font-medium text-gray-900">{formatDateTime(selectedNotification.createdAt)}</span>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between items-center border-t border-gray-100">
              <Button 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                onClick={() => confirmDelete(selectedNotification)}
              >
                Delete
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
                {selectedNotification.status === 'Unread' && (
                  <Button onClick={() => handleMarkAsRead(selectedNotification.id)}>
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modals */}
      <Modal
        isOpen={isMarkAllModalOpen}
        onClose={() => setIsMarkAllModalOpen(false)}
        title="Confirm Action"
      >
        <div className="space-y-4">
          <p className="text-gray-700">Are you sure you want to mark all <strong>{unreadCount}</strong> unread notifications as read?</p>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsMarkAllModalOpen(false)}>Cancel</Button>
            <Button onClick={handleMarkAllAsReadConfirm}>Yes, Mark All Read</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Notification"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-red-50 text-red-800 rounded border border-red-100">
            <AlertTriangle size={20} />
            <p className="text-sm">Are you sure you want to delete this notification? This action cannot be undone.</p>
          </div>
          {selectedNotification && (
            <p className="text-sm font-medium text-gray-700">ID: {selectedNotification.id} - {selectedNotification.title}</p>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white border-red-600">Delete Permanently</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Notifications;;
