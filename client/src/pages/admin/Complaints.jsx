import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';
import { Search, Edit2, AlertCircle, Eye, RefreshCw, AlertTriangle, Clock, MapPin, User, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { mockComplaints, complaintCategories, complaintPriorities, complaintStatuses, OVERDUE_THRESHOLD_DAYS } from '../../data/mockComplaints';
import { villagesList } from '../../data/mockUsers';
import { operatorsList } from '../../data/mockVillages';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Status Update State
  const [newStatus, setNewStatus] = useState('');
  const [resolutionRemarks, setResolutionRemarks] = useState('');

  // Fetch records
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        setComplaints(mockComplaints);
        setError(null);
      } catch (err) {
        setError('Failed to fetch complaints. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const getDaysOld = (dateString) => {
    const today = new Date('2026-08-13T00:00:00Z'); // Mock today matching context
    const submitted = new Date(dateString);
    const diffTime = Math.abs(today - submitted);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const isOverdue = (complaint) => {
    if (complaint.status === 'Resolved' || complaint.status === 'Closed') return false;
    return getDaysOld(complaint.createdAt) >= OVERDUE_THRESHOLD_DAYS;
  };

  // Filtered Records
  const filteredComplaints = complaints.filter(c => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      c.villagerName.toLowerCase().includes(searchLower) || 
      c.id.toLowerCase().includes(searchLower) ||
      c.village.toLowerCase().includes(searchLower) ||
      c.subject.toLowerCase().includes(searchLower);
    
    const matchesVillage = villageFilter ? c.village === villageFilter : true;
    const matchesCategory = categoryFilter ? c.category === categoryFilter : true;
    const matchesPriority = priorityFilter ? c.priority === priorityFilter : true;
    const matchesStatus = statusFilter ? c.status === statusFilter : true;
    const matchesOperator = operatorFilter ? c.assignedOperator === operatorFilter : true;
    const matchesDate = dateFilter ? c.submittedDate === dateFilter : true;

    return matchesSearch && matchesVillage && matchesCategory && matchesPriority && matchesStatus && matchesOperator && matchesDate;
  });

  // Summary Calculations
  const totalComplaints = complaints.length;
  const newComplaints = complaints.filter(c => c.status === 'New').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
  const closedComplaints = complaints.filter(c => c.status === 'Closed').length;
  const overdueComplaints = complaints.filter(c => isOverdue(c)).length;

  // Analytics Data
  const statusData = complaintStatuses.map(status => ({
    name: status,
    value: complaints.filter(c => c.status === status).length
  })).filter(d => d.value > 0);

  const priorityData = complaintPriorities.map(priority => ({
    name: priority,
    value: complaints.filter(c => c.priority === priority).length
  })).filter(d => d.value > 0);

  // Handlers
  const handleClearFilters = () => {
    setSearchTerm('');
    setVillageFilter('');
    setCategoryFilter('');
    setPriorityFilter('');
    setStatusFilter('');
    setOperatorFilter('');
    setDateFilter('');
  };

  const handleOpenViewModal = (complaint) => {
    setSelectedComplaint(complaint);
    setIsViewModalOpen(true);
  };

  const handleOpenStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setResolutionRemarks(complaint.resolutionRemarks || '');
    setIsStatusModalOpen(true);
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (selectedComplaint) {
      setComplaints(complaints.map(c => {
        if (c.id === selectedComplaint.id) {
          const isResolvingOrClosing = newStatus === 'Resolved' || newStatus === 'Closed';
          return { 
            ...c, 
            status: newStatus,
            resolutionRemarks: isResolvingOrClosing ? resolutionRemarks : c.resolutionRemarks,
            resolvedAt: (isResolvingOrClosing && !c.resolvedAt) ? new Date().toISOString() : c.resolvedAt,
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      }));
    }
    setIsStatusModalOpen(false);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'New': return 'primary';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'default';
      case 'Reopened': return 'danger';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'Low': return 'default';
      case 'Medium': return 'primary';
      case 'High': return 'warning';
      case 'Critical': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Date', accessor: 'submittedDate' },
    { header: 'Villager', accessor: 'villagerName' },
    { header: 'Village', accessor: 'village' },
    { header: 'Category', accessor: 'category' },
    { 
      header: 'Priority', 
      accessor: 'priority',
      render: (row) => (
        <Badge variant={getPriorityBadgeVariant(row.priority)}>
          {row.priority}
        </Badge>
      )
    },
    { header: 'Operator', accessor: 'assignedOperator' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <div className="flex flex-col gap-1 items-start">
          <Badge variant={getStatusBadgeVariant(row.status)}>
            {row.status}
          </Badge>
          {isOverdue(row) && (
            <span className="text-[10px] font-bold text-red-600 uppercase bg-red-100 px-1.5 py-0.5 rounded">Overdue</span>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-3">
          <button onClick={() => handleOpenViewModal(row)} className="text-gray-500 hover:text-gov-blue" title="View Details">
            <Eye size={18} />
          </button>
          <button onClick={() => handleOpenStatusModal(row)} className="text-gray-500 hover:text-gov-blue" title="Update Status">
            <Edit2 size={18} />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
        <span className="ml-2 text-gray-600">Loading complaints...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Complaint Management</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor water-service complaints, resolution progress and accountability across registered villages.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-gray-50 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">{totalComplaints}</h3>
          <p className="text-xs font-medium text-gray-500 uppercase mt-1">Total</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-blue-50 border-blue-200">
          <h3 className="text-2xl font-bold text-blue-900">{newComplaints}</h3>
          <p className="text-xs font-medium text-blue-700 uppercase mt-1">New</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-amber-50 border-amber-200">
          <h3 className="text-2xl font-bold text-amber-900">{inProgressComplaints}</h3>
          <p className="text-xs font-medium text-amber-700 uppercase mt-1">In Progress</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-green-50 border-green-200">
          <h3 className="text-2xl font-bold text-green-900">{resolvedComplaints}</h3>
          <p className="text-xs font-medium text-green-700 uppercase mt-1">Resolved</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-gray-100 border-gray-300">
          <h3 className="text-2xl font-bold text-gray-700">{closedComplaints}</h3>
          <p className="text-xs font-medium text-gray-600 uppercase mt-1">Closed</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-red-50 border-red-200">
          <h3 className="text-2xl font-bold text-red-900">{overdueComplaints}</h3>
          <p className="text-xs font-medium text-red-700 uppercase mt-1">Overdue</p>
        </Card>
      </div>

      {/* Analytics Charts & Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaints by Status</h3>
          <div className="h-48 flex items-center justify-center">
             <PieChart 
                data={statusData}
                colors={['#3b82f6', '#f59e0b', '#10b981', '#9ca3af', '#ef4444']}
             />
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaints by Priority</h3>
          <div className="h-48 flex items-center justify-center">
             <BarChart 
                data={priorityData}
                xKey="name"
                yKey="value"
                colors={['#9ca3af', '#3b82f6', '#f59e0b', '#ef4444']}
             />
          </div>
        </Card>
        <Card className="p-4 bg-red-50/50 border-red-100 flex flex-col">
          <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} /> Needs Attention
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {complaints.filter(c => isOverdue(c) || c.priority === 'Critical').length === 0 ? (
              <p className="text-gray-500 text-sm italic">No critical or overdue complaints.</p>
            ) : (
              complaints.filter(c => isOverdue(c) || c.priority === 'Critical').map(c => (
                <div key={c.id} className="bg-white p-3 border rounded shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{c.id}</span>
                    {isOverdue(c) && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">OVERDUE</span>}
                  </div>
                  <p className="text-xs text-gray-600 flex items-center gap-1 mb-1"><MapPin size={10} /> {c.village}</p>
                  <p className="text-xs text-gray-600 flex items-center gap-1"><User size={10} /> Operator: {c.assignedOperator}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 items-end">
          <div className="relative xl:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <Input 
              placeholder="Search ID, villager, or subject..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            options={[{ label: 'All Villages', value: '' }, ...villagesList.map(v => ({ label: v, value: v }))]}
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
          />

          <Select
            options={[{ label: 'All Categories', value: '' }, ...complaintCategories.map(c => ({ label: c, value: c }))]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />

          <Select
            options={[{ label: 'All Priorities', value: '' }, ...complaintPriorities.map(p => ({ label: p, value: p }))]}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          />

          <Select
            options={[{ label: 'All Statuses', value: '' }, ...complaintStatuses.map(s => ({ label: s, value: s }))]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />

          <Select
            options={[{ label: 'All Operators', value: '' }, ...operatorsList.map(o => ({ label: o.name, value: o.name }))]}
            value={operatorFilter}
            onChange={(e) => setOperatorFilter(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 items-end justify-between">
          <div className="w-48">
            <Input 
              type="date"
              label="Date Submitted"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          {/* Clear Filters Button */}
          {(searchTerm || villageFilter || categoryFilter || priorityFilter || statusFilter || operatorFilter || dateFilter) && (
            <button 
              onClick={handleClearFilters}
              className="text-sm text-gov-blue hover:underline flex items-center gap-1 font-medium pb-2"
            >
              <RefreshCw size={14} /> Clear all filters
            </button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table columns={columns} data={filteredComplaints} keyExtractor={row => row.id} />
      </Card>

      {/* Status Update Confirmation Modal */}
      <Modal 
        isOpen={isStatusModalOpen} 
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Complaint Status"
      >
        <form onSubmit={handleStatusSubmit} className="space-y-4">
          <div className="bg-blue-50 text-blue-800 p-3 rounded text-sm flex gap-2">
            <AlertCircle className="flex-shrink-0" size={18} />
            <p>You are updating administrative status for <strong>{selectedComplaint?.id}</strong>. Operators typically update their own resolution progress.</p>
          </div>
          
          <Select 
            label="New Status" 
            required
            options={complaintStatuses.map(s => ({ label: s, value: s }))}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />

          {(newStatus === 'Resolved' || newStatus === 'Closed') && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Resolution Remarks</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gov-blue focus:border-gov-blue"
                rows="3"
                value={resolutionRemarks}
                onChange={(e) => setResolutionRemarks(e.target.value)}
                placeholder="Details of how this was resolved or why it was closed..."
                required
              />
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button variant="outline" type="button" onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
            <Button type="submit">Confirm Update</Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal with Timeline */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        title="Complaint Details"
        className="max-w-3xl"
      >
        {selectedComplaint && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedComplaint.subject}</h3>
                <p className="text-sm text-gray-500 mt-1">ID: {selectedComplaint.id}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={getPriorityBadgeVariant(selectedComplaint.priority)}>
                  Priority: {selectedComplaint.priority}
                </Badge>
                <Badge variant={getStatusBadgeVariant(selectedComplaint.status)}>
                  {selectedComplaint.status}
                </Badge>
              </div>
            </div>

            {/* Overdue Warning */}
            {isOverdue(selectedComplaint) && (
              <div className="bg-red-50 text-red-700 p-3 rounded flex gap-2 border border-red-200">
                <AlertTriangle className="flex-shrink-0" size={20} />
                <p className="text-sm font-medium">This complaint is overdue! It has been open for {getDaysOld(selectedComplaint.createdAt)} days.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Details */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 italic">"{selectedComplaint.description}"</p>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm border-t border-gray-100 pt-4">
                  <div className="flex flex-col border-b border-dashed pb-1">
                    <span className="text-gray-500 flex items-center gap-1 mb-1"><User size={14} /> Villager Name</span>
                    <span className="font-medium text-gray-900">{selectedComplaint.villagerName}</span>
                  </div>
                  <div className="flex flex-col border-b border-dashed pb-1">
                    <span className="text-gray-500 flex items-center gap-1 mb-1"><MapPin size={14} /> Village</span>
                    <span className="font-medium text-gray-900">{selectedComplaint.village}</span>
                  </div>
                  <div className="flex flex-col border-b border-dashed pb-1">
                    <span className="text-gray-500 mb-1">Category</span>
                    <span className="font-medium text-gray-900">{selectedComplaint.category}</span>
                  </div>
                  <div className="flex flex-col border-b border-dashed pb-1">
                    <span className="text-gray-500 mb-1">Assigned Operator</span>
                    <span className="font-medium text-gov-blue">{selectedComplaint.assignedOperator}</span>
                  </div>
                </div>

                {(selectedComplaint.status === 'Resolved' || selectedComplaint.status === 'Closed') && selectedComplaint.resolutionRemarks && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1"><MessageSquare size={16} /> Resolution Remarks</h4>
                    <p className="text-sm text-gray-700 bg-green-50 border border-green-100 p-3 rounded">{selectedComplaint.resolutionRemarks}</p>
                  </div>
                )}
              </div>

              {/* Right Column: Accountability Timeline */}
              <div className="border-l border-gray-200 pl-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-1"><Clock size={16} /> Accountability Timeline</h4>
                
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
                  {/* Submitted */}
                  <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-gov-blue rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                    <p className="text-sm font-medium text-gray-900">Submitted</p>
                    <p className="text-xs text-gray-500">{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                  </div>
                  
                  {/* Assigned / In Progress */}
                  {(selectedComplaint.status !== 'New') && (
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-amber-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                      <p className="text-sm font-medium text-gray-900">Work Started</p>
                      <p className="text-xs text-gray-500">Operator assigned & working</p>
                    </div>
                  )}

                  {/* Resolved */}
                  {(selectedComplaint.status === 'Resolved' || selectedComplaint.status === 'Closed') && (
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                      <p className="text-sm font-medium text-gray-900">Resolved</p>
                      <p className="text-xs text-gray-500">{selectedComplaint.resolvedAt ? new Date(selectedComplaint.resolvedAt).toLocaleString() : 'Date unavailable'}</p>
                    </div>
                  )}

                  {/* Closed */}
                  {selectedComplaint.status === 'Closed' && (
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-gray-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                      <p className="text-sm font-medium text-gray-900">Closed</p>
                      <p className="text-xs text-gray-500">Verified by Admin</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
              <Button onClick={() => { setIsViewModalOpen(false); handleOpenStatusModal(selectedComplaint); }}>Update Status</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Complaints;
