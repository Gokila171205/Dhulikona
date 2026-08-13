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
  Droplet, Settings, PenTool, CreditCard, Activity, Calendar, Info
} from 'lucide-react';
import { 
  mockNotifications, notificationTypes, priorityLevels, statusOptions 
} from '../../data/mockNotifications';
import { villagesList } from '../../data/mockUsers';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [villageFilter, setVillageFilter] = useState('');

  // Modals state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isMarkAllModalOpen, setIsMarkAllModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setNotifications(mockNotifications);
        setError(null);
      } catch (err) {
        setError('Failed to fetch notifications.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Filter Logic
  const filteredNotifications = notifications.filter(n => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      n.title.toLowerCase().includes(searchLower) || 
      n.id.toLowerCase().includes(searchLower) ||
      n.message.toLowerCase().includes(searchLower) ||
      n.village.toLowerCase().includes(searchLower);
    
    const matchesType = typeFilter ? n.type === typeFilter : true;
    const matchesPriority = priorityFilter ? n.priority === priorityFilter : true;
    const matchesStatus = statusFilter ? n.status === statusFilter : true;
    const matchesVillage = villageFilter ? n.village === villageFilter : true;

    return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesVillage;
  });

  // Calculate Summaries
  const totalNotifications = notifications.length;
  const unreadCount = notifications.filter(n => n.status === 'Unread').length;
  const criticalCount = notifications.filter(n => n.priority === 'Critical' && n.status === 'Unread').length;
  const highPriorityCount = notifications.filter(n => n.priority === 'High' && n.status === 'Unread').length;
  const readCount = notifications.filter(n => n.status === 'Read').length;

  // Actions
  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setPriorityFilter('');
    setStatusFilter('');
    setVillageFilter('');
  };

  const handleView = (notification) => {
    setSelectedNotification(notification);
    setIsViewModalOpen(true);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, status: 'Read', lastUpdated: new Date().toISOString() } : n
    ));
    
    // Also update selected if it's currently open
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification({ ...selectedNotification, status: 'Read' });
    }
  };

  const handleMarkAllAsReadConfirm = () => {
    setNotifications(notifications.map(n => ({ ...n, status: 'Read', lastUpdated: new Date().toISOString() })));
    setIsMarkAllModalOpen(false);
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

  // UI Helpers
  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'Critical': return 'danger';
      case 'High': return 'warning';
      case 'Medium': return 'primary';
      case 'Low': return 'default';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Water Quality': return <Droplet size={14} className="text-blue-500" />;
      case 'Pump': return <Settings size={14} className="text-gray-500" />;
      case 'Maintenance': return <PenTool size={14} className="text-amber-500" />;
      case 'Complaint': return <AlertTriangle size={14} className="text-red-500" />;
      case 'Payment': return <CreditCard size={14} className="text-green-500" />;
      case 'Water Supply': return <Droplet size={14} className="text-cyan-500" />;
      case 'System': return <Activity size={14} className="text-purple-500" />;
      default: return <Bell size={14} className="text-gray-500" />;
    }
  };

  const columns = [
    { 
      header: 'ID / Date', 
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800 text-xs">{row.id}</p>
          <p className="text-[10px] text-gray-500">{new Date(row.createdDate).toLocaleDateString()}</p>
        </div>
      )
    },
    { 
      header: 'Type', 
      render: (row) => (
        <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
          {getTypeIcon(row.type)} {row.type}
        </div>
      )
    },
    { 
      header: 'Notification Details', 
      render: (row) => (
        <div className="max-w-xs md:max-w-md">
          <p className={`font-semibold ${row.status === 'Unread' ? 'text-gray-900' : 'text-gray-600'}`}>{row.title}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{row.message}</p>
        </div>
      )
    },
    { header: 'Village', accessor: 'village' },
    { 
      header: 'Priority', 
      render: (row) => (
        <Badge variant={getPriorityBadgeVariant(row.priority)}>
          {row.priority}
        </Badge>
      )
    },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`text-xs font-bold uppercase ${row.status === 'Unread' ? 'text-gov-blue' : 'text-gray-400'}`}>
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
          <h3 className="text-2xl font-bold text-red-700 flex items-center gap-1">
            {criticalCount} {criticalCount > 0 && <ShieldAlert size={16} />}
          </h3>
          <p className="text-[10px] font-semibold uppercase text-red-600 mt-1">Critical (Unread)</p>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-200 text-center flex flex-col justify-center items-center shadow-sm">
          <h3 className="text-2xl font-bold text-amber-700">{highPriorityCount}</h3>
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
              {notifications.filter(n => n.status === 'Unread' && (n.priority === 'Critical' || n.priority === 'High')).length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle size={32} className="text-green-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-500">You're all caught up!</p>
                  <p className="text-xs text-gray-400 mt-1">No critical or high priority alerts pending.</p>
                </div>
              ) : (
                notifications
                  .filter(n => n.status === 'Unread' && (n.priority === 'Critical' || n.priority === 'High'))
                  .map(n => (
                    <div 
                      key={n.id} 
                      className={`p-3 rounded border shadow-sm hover:shadow cursor-pointer transition-shadow ${n.priority === 'Critical' ? 'bg-white border-red-200 border-l-4 border-l-red-500' : 'bg-white border-amber-200 border-l-4 border-l-amber-500'}`}
                      onClick={() => handleView(n)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{n.type}</span>
                        <span className="text-[10px] font-semibold text-gray-400">{new Date(n.createdDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="relative lg:col-span-1">
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
                options={[{ label: 'All Types', value: '' }, ...notificationTypes.map(t => ({ label: t, value: t }))]}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              />

              <Select
                options={[{ label: 'All Priorities', value: '' }, ...priorityLevels.map(p => ({ label: p, value: p }))]}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              />
              
              <Select
                options={[{ label: 'All Statuses', value: '' }, ...statusOptions.map(s => ({ label: s, value: s }))]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />

              <Select
                options={[{ label: 'All Villages', value: '' }, ...villagesList.map(v => ({ label: v, value: v }))]}
                value={villageFilter}
                onChange={(e) => setVillageFilter(e.target.value)}
              />
            </div>
            
            {(searchTerm || typeFilter || priorityFilter || statusFilter || villageFilter) && (
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
                <div className={`mt-1 p-2 rounded-full ${selectedNotification.priority === 'Critical' ? 'bg-red-100 text-red-600' : selectedNotification.priority === 'High' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                  {getTypeIcon(selectedNotification.type)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{selectedNotification.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <Badge variant={getPriorityBadgeVariant(selectedNotification.priority)}>
                      {selectedNotification.priority} Priority
                    </Badge>
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
                <span className="font-medium text-gray-900">{selectedNotification.type}</span>
              </div>
              <div className="flex flex-col border-b border-dashed pb-1">
                <span className="text-gray-500 flex items-center gap-1 mb-1"><Calendar size={14} /> Generated On</span>
                <span className="font-medium text-gray-900">{new Date(selectedNotification.createdDate).toLocaleString()}</span>
              </div>
              <div className="flex flex-col border-b border-dashed pb-1">
                <span className="text-gray-500 flex items-center gap-1 mb-1"><Activity size={14} /> Created By</span>
                <span className="font-medium text-gray-900">{selectedNotification.createdBy}</span>
              </div>
            </div>

            {/* Related Entity Reference */}
            {selectedNotification.relatedId && (
              <div className="bg-blue-50 border border-blue-100 rounded p-3 flex justify-between items-center mt-2">
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase mb-0.5">Related Record</p>
                  <p className="text-sm font-medium text-blue-900">{selectedNotification.relatedType.toUpperCase()} : {selectedNotification.relatedId}</p>
                </div>
                <Button size="sm" variant="outline" className="bg-white">Go to Record</Button>
              </div>
            )}
            
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

export default Notifications;
