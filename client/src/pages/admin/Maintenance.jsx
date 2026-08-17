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
import { Search, Edit2, AlertCircle, Eye, RefreshCw, AlertTriangle, Clock, MapPin, User, Calendar, Wrench, ArrowRight, Settings, Plus, UserPlus } from 'lucide-react';
import { mockMaintenance, maintenanceTypes, maintenancePriorities, maintenanceStatuses } from '../../data/mockMaintenance';
import api from '../../services/api';

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [villages, setVillages] = useState([]);
  const [operators, setOperators] = useState([]);
  const [pumps, setPumps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignConfirmOpen, setIsAssignConfirmOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    pumpId: '',
    pumpName: '',
    village: '',
    maintenanceType: 'Preventive',
    problemDescription: '',
    priority: 'Low',
    assignedOperator: '',
    requestDate: '',
    scheduledDate: '',
    startDate: '',
    completionDate: '',
    status: 'Pending',
    resolutionDescription: '',
    remarks: ''
  });
  
  // Tracking if operator was changed for the confirm modal
  const [pendingOperatorChange, setPendingOperatorChange] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const [mntRes, villagesRes, operatorsRes, pumpsRes] = await Promise.all([
        api.get('/maintenance?limit=100'),
        api.get('/villages?limit=100'),
        api.get('/users?role=operator&limit=100'),
        api.get('/pumps?limit=100')
      ]);
      setVillages(villagesRes.data);
      setOperators(operatorsRes.data);
      setPumps(pumpsRes.data);

      const mapped = mntRes.data.map(r => ({
        id: r._id.toString(),
        pumpId: r.pump?._id || '',
        pumpName: r.pump?.name || 'Unknown Pump',
        village: r.pump?.village?.name || 'Unknown Village',
        maintenanceType: r.complaint ? 'Corrective' : 'Preventive',
        problemDescription: r.issue,
        priority: r.priority,
        assignedOperator: r.assignedTo?.name || 'Unassigned',
        operatorId: r.assignedTo?._id || '',
        requestDate: r.startDate,
        scheduledDate: r.startDate,
        startDate: r.startDate,
        completionDate: r.endDate || '',
        status: r.status,
        resolutionDescription: r.remarks || '',
        remarks: r.remarks || ''
      }));
      setRecords(mapped);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch maintenance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const isOverdue = (record) => {
    if (record.status === 'Completed' || record.status === 'Cancelled') return false;
    if (!record.scheduledDate) return false;
    
    const today = new Date('2026-08-13T00:00:00Z'); // Mock today matching context
    const scheduled = new Date(record.scheduledDate);
    return scheduled < today;
  };

  // Filtered Records
  const filteredRecords = records.filter(r => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (r.pumpName && r.pumpName.toLowerCase().includes(searchLower)) || 
      (r.assignedOperator && r.assignedOperator.toLowerCase().includes(searchLower)) || 
      r.id.toLowerCase().includes(searchLower) ||
      r.pumpId.toLowerCase().includes(searchLower) ||
      r.village.toLowerCase().includes(searchLower);
    
    const matchesVillage = villageFilter ? r.village === villageFilter : true;
    const matchesType = typeFilter ? r.maintenanceType === typeFilter : true;
    const matchesPriority = priorityFilter ? r.priority === priorityFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    const matchesOperator = operatorFilter ? r.assignedOperator === operatorFilter : true;
    const matchesDate = dateFilter ? r.requestDate === dateFilter : true;

    return matchesSearch && matchesVillage && matchesType && matchesPriority && matchesStatus && matchesOperator && matchesDate;
  });

  // Summary Calculations
  const totalRecords = records.length;
  const pendingRecords = records.filter(r => r.status === 'Pending').length;
  const inProgressRecords = records.filter(r => r.status === 'In Progress').length;
  const completedRecords = records.filter(r => r.status === 'Completed').length;
  const overdueRecords = records.filter(r => isOverdue(r)).length;
  const emergencyRecords = records.filter(r => r.maintenanceType === 'Emergency').length;

  // Analytics Data
  const statusData = maintenanceStatuses.map(status => ({
    name: status,
    value: records.filter(r => r.status === status).length
  })).filter(d => d.value > 0);

  const typeData = maintenanceTypes.map(type => ({
    name: type,
    value: records.filter(r => r.maintenanceType === type).length
  })).filter(d => d.value > 0);

  // Handlers
  const handleClearFilters = () => {
    setSearchTerm('');
    setVillageFilter('');
    setTypeFilter('');
    setPriorityFilter('');
    setStatusFilter('');
    setOperatorFilter('');
    setDateFilter('');
  };

  const handleOpenViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setSelectedRecord(null);
    setFormData({
      pumpId: '', pumpName: '', village: '', maintenanceType: 'Preventive',
      problemDescription: '', priority: 'Low', assignedOperator: '',
      requestDate: new Date().toISOString().split('T')[0], scheduledDate: '',
      startDate: '', completionDate: '', status: 'Pending', resolutionDescription: '', remarks: ''
    });
    setPendingOperatorChange(false);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setSelectedRecord(record);
    setFormData({ 
      ...record,
      startDate: record.startDate || '',
      completionDate: record.completionDate || '',
      assignedOperator: record.assignedOperator || ''
    });
    setPendingOperatorChange(false);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Check if operator assignment needs confirmation
    if (selectedRecord && selectedRecord.assignedOperator !== formData.assignedOperator && selectedRecord.assignedOperator) {
      setIsAssignConfirmOpen(true);
      return;
    }
    
    saveForm();
  };

  const saveForm = async () => {
    setIsSaving(true);
    try {
      const pDoc = pumps.find(p => p.name === formData.pumpName || p.id === formData.pumpId || p._id === formData.pumpId);
      if (!pDoc) throw new Error('Selected pump ID/name is invalid.');

      const opDoc = operators.find(o => o.name === formData.assignedOperator);
      
      const payload = {
        pump: pDoc.id || pDoc._id,
        assignedTo: opDoc?._id || null,
        issue: formData.problemDescription,
        priority: formData.priority,
        status: formData.status,
        startDate: formData.startDate || formData.requestDate || new Date().toISOString().split('T')[0],
        endDate: formData.completionDate || '',
        remarks: formData.resolutionDescription || formData.remarks || ''
      };

      if (selectedRecord) {
        await api.put(`/maintenance/${selectedRecord.id}`, payload);
      } else {
        await api.post('/maintenance', payload);
      }

      setIsFormModalOpen(false);
      setIsAssignConfirmOpen(false);
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save maintenance record.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Assigned': return 'primary';
      case 'In Progress': return 'warning';
      case 'Completed': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'Low': return 'default';
      case 'Medium': return 'primary';
      case 'High': return 'warning';
      case 'Emergency': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    { header: 'MNT ID', accessor: 'id' },
    { header: 'Pump ID', accessor: 'pumpId' },
    { header: 'Village', accessor: 'village' },
    { header: 'Type', accessor: 'maintenanceType' },
    { 
      header: 'Priority', 
      accessor: 'priority',
      render: (row) => (
        <Badge variant={getPriorityBadgeVariant(row.priority)}>
          {row.priority}
        </Badge>
      )
    },
    { 
      header: 'Operator', 
      accessor: 'assignedOperator',
      render: (row) => row.assignedOperator || <span className="text-gray-400 italic">Unassigned</span>
    },
    { header: 'Scheduled', accessor: 'scheduledDate' },
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
          <button onClick={() => handleOpenEditModal(row)} className="text-gray-500 hover:text-gov-blue" title="Edit/Assign">
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
        <span className="ml-2 text-gray-600">Loading maintenance records...</span>
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
          <h2 className="text-2xl font-bold text-gray-800">Maintenance Management</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor pump maintenance activities, assigned operators, repair progress and maintenance history across villages.</p>
        </div>
        <Button onClick={handleOpenAddModal} className="flex items-center gap-2 whitespace-nowrap">
          <Plus size={18} /> Add Record
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-gray-50 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">{totalRecords}</h3>
          <p className="text-xs font-medium text-gray-500 uppercase mt-1">Total</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-gray-100 border-gray-300">
          <h3 className="text-2xl font-bold text-gray-700">{pendingRecords}</h3>
          <p className="text-xs font-medium text-gray-600 uppercase mt-1">Pending</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-amber-50 border-amber-200">
          <h3 className="text-2xl font-bold text-amber-900">{inProgressRecords}</h3>
          <p className="text-xs font-medium text-amber-700 uppercase mt-1">In Progress</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-green-50 border-green-200">
          <h3 className="text-2xl font-bold text-green-900">{completedRecords}</h3>
          <p className="text-xs font-medium text-green-700 uppercase mt-1">Completed</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-red-50 border-red-200">
          <h3 className="text-2xl font-bold text-red-900">{overdueRecords}</h3>
          <p className="text-xs font-medium text-red-700 uppercase mt-1">Overdue</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-orange-50 border-orange-200">
          <h3 className="text-2xl font-bold text-orange-900">{emergencyRecords}</h3>
          <p className="text-xs font-medium text-orange-700 uppercase mt-1">Emergency</p>
        </Card>
      </div>

      {/* Analytics Charts & Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Distribution</h3>
          <div className="h-48 flex items-center justify-center">
             <PieChart 
                data={statusData}
                colors={['#9ca3af', '#3b82f6', '#f59e0b', '#10b981', '#ef4444']}
             />
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Maintenance Types</h3>
          <div className="h-48 flex items-center justify-center">
             <BarChart 
                data={typeData}
                xKey="name"
                yKey="value"
                colors={['#3b82f6', '#f59e0b', '#ef4444']}
             />
          </div>
        </Card>
        <Card className="p-4 bg-red-50/50 border-red-100 flex flex-col">
          <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} /> Needs Attention
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {records.filter(r => isOverdue(r) || r.maintenanceType === 'Emergency' || (r.priority === 'High' && r.status === 'Pending')).length === 0 ? (
              <p className="text-gray-500 text-sm italic">No records require immediate attention.</p>
            ) : (
              records.filter(r => isOverdue(r) || r.maintenanceType === 'Emergency' || (r.priority === 'High' && r.status === 'Pending')).map(r => (
                <div key={r.id} className="bg-white p-3 border rounded shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{r.pumpId}</span>
                    <div className="flex gap-1">
                      {isOverdue(r) && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">OVERDUE</span>}
                      {r.maintenanceType === 'Emergency' && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">EMERGENCY</span>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 flex items-center gap-1 mb-1"><MapPin size={10} /> {r.village}</p>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <User size={10} /> {r.assignedOperator ? `Assigned: ${r.assignedOperator}` : <span className="text-red-500 font-medium">Unassigned</span>}
                  </p>
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
              placeholder="Search ID, Pump, Village, Operator..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            options={[{ label: 'All Villages', value: '' }, ...villages.map(v => ({ label: v.name, value: v.name }))]}
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
          />

          <Select
            options={[{ label: 'All Types', value: '' }, ...maintenanceTypes.map(t => ({ label: t, value: t }))]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />

          <Select
            options={[{ label: 'All Priorities', value: '' }, ...maintenancePriorities.map(p => ({ label: p, value: p }))]}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          />

          <Select
            options={[{ label: 'All Statuses', value: '' }, ...maintenanceStatuses.map(s => ({ label: s, value: s }))]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />

          <Select
            options={[{ label: 'All Operators', value: '' }, ...operators.map(o => ({ label: o.name, value: o.name }))]}
            value={operatorFilter}
            onChange={(e) => setOperatorFilter(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 items-end justify-between">
          <div className="w-48">
            <Input 
              type="date"
              label="Request Date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          {/* Clear Filters Button */}
          {(searchTerm || villageFilter || typeFilter || priorityFilter || statusFilter || operatorFilter || dateFilter) && (
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
        <Table columns={columns} data={filteredRecords} keyExtractor={row => row.id} />
      </Card>

      {/* Assign Confirmation Modal */}
      <Modal
        isOpen={isAssignConfirmOpen}
        onClose={() => setIsAssignConfirmOpen(false)}
        title="Confirm Reassignment"
      >
        <div className="space-y-4">
          <div className="bg-warning/10 text-warning p-3 rounded flex gap-2">
            <AlertCircle className="flex-shrink-0" size={20} />
            <p className="text-sm">
              You are reassigning this maintenance task from <strong>{selectedRecord?.assignedOperator}</strong> to <strong>{formData.assignedOperator}</strong>.
            </p>
          </div>
          <p className="text-sm text-gray-600">The current technician/operator will be removed from this task. Do you want to proceed?</p>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button variant="outline" onClick={() => setIsAssignConfirmOpen(false)}>Cancel</Button>
            <Button onClick={saveForm}>Confirm Reassignment</Button>
          </div>
        </div>
      </Modal>

      {/* Form Modal (Add/Edit/Assign) */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title={selectedRecord ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1 pb-1">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Pump ID" 
              required 
              value={formData.pumpId}
              onChange={(e) => setFormData({...formData, pumpId: e.target.value})}
            />
            <Select 
              label="Village" 
              required
              options={[{ label: 'Select Village...', value: '' }, ...villages.map(v => ({ label: v.name, value: v.name }))]}
              value={formData.village}
              onChange={(e) => setFormData({...formData, village: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Maintenance Type" 
              required
              options={maintenanceTypes.map(t => ({ label: t, value: t }))}
              value={formData.maintenanceType}
              onChange={(e) => setFormData({...formData, maintenanceType: e.target.value})}
            />
            <Select 
              label="Priority" 
              required
              options={maintenancePriorities.map(p => ({ label: p, value: p }))}
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Problem Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gov-blue focus:border-gov-blue"
              rows="2"
              value={formData.problemDescription}
              onChange={(e) => setFormData({...formData, problemDescription: e.target.value})}
              required
            />
          </div>

          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <UserPlus size={16} /> Assign Operator / Technician
            </label>
            <Select 
              options={[{ label: 'Unassigned', value: '' }, ...operators.map(o => ({ label: o.name, value: o.name }))]}
              value={formData.assignedOperator}
              onChange={(e) => {
                setFormData({...formData, assignedOperator: e.target.value});
                if (!formData.status || formData.status === 'Pending') {
                   setFormData(prev => ({...prev, status: e.target.value ? 'Assigned' : 'Pending'}));
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Village Operators act as Technicians in the JalTrack system.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Request Date" 
              type="date"
              required 
              value={formData.requestDate}
              onChange={(e) => setFormData({...formData, requestDate: e.target.value})}
            />
            <Input 
              label="Scheduled Date" 
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Input 
              label="Start Date" 
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
            <Input 
              label="Completion Date" 
              type="date"
              value={formData.completionDate}
              onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
            />
          </div>

          <Select 
            label="Status" 
            required
            options={maintenanceStatuses.map(s => ({ label: s, value: s }))}
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          />

          {(formData.status === 'Completed' || formData.status === 'In Progress') && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Resolution / Work Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gov-blue focus:border-gov-blue"
                rows="2"
                value={formData.resolutionDescription}
                onChange={(e) => setFormData({...formData, resolutionDescription: e.target.value})}
              />
            </div>
          )}
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Remarks (Optional)</label>
            <Input 
              value={formData.remarks}
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button variant="outline" type="button" onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Record'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal with Timeline */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        title="Maintenance Details"
        className="max-w-3xl"
      >
        {selectedRecord && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedRecord.pumpName || selectedRecord.pumpId}</h3>
                <p className="text-sm text-gray-500 mt-1">ID: {selectedRecord.id} | Village: {selectedRecord.village}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={getPriorityBadgeVariant(selectedRecord.priority)}>
                  {selectedRecord.priority} Priority
                </Badge>
                <Badge variant={getStatusBadgeVariant(selectedRecord.status)}>
                  {selectedRecord.status}
                </Badge>
              </div>
            </div>

            {/* Overdue Warning */}
            {isOverdue(selectedRecord) && (
              <div className="bg-red-50 text-red-700 p-3 rounded flex gap-2 border border-red-200">
                <AlertTriangle className="flex-shrink-0" size={20} />
                <p className="text-sm font-medium">This maintenance task is overdue! It was scheduled for {selectedRecord.scheduledDate}.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Details */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-800 mb-1">Problem Description</p>
                  <p className="text-sm text-gray-700 italic">"{selectedRecord.problemDescription}"</p>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm border-t border-gray-100 pt-4">
                  <div className="flex flex-col border-b border-dashed pb-1">
                    <span className="text-gray-500 mb-1">Maintenance Type</span>
                    <span className="font-medium text-gray-900">{selectedRecord.maintenanceType}</span>
                  </div>
                  <div className="flex flex-col border-b border-dashed pb-1">
                    <span className="text-gray-500 flex items-center gap-1 mb-1"><User size={14} /> Assigned Operator</span>
                    <span className={selectedRecord.assignedOperator ? "font-medium text-gov-blue" : "font-medium text-red-500"}>
                      {selectedRecord.assignedOperator || 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex flex-col border-b border-dashed pb-1">
                    <span className="text-gray-500 flex items-center gap-1 mb-1"><Calendar size={14} /> Request Date</span>
                    <span className="font-medium text-gray-900">{selectedRecord.requestDate}</span>
                  </div>
                  <div className="flex flex-col border-b border-dashed pb-1">
                    <span className="text-gray-500 flex items-center gap-1 mb-1"><Clock size={14} /> Scheduled Date</span>
                    <span className="font-medium text-gray-900">{selectedRecord.scheduledDate || '-'}</span>
                  </div>
                </div>

                {selectedRecord.resolutionDescription && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1"><Settings size={16} /> Work Description</h4>
                    <p className="text-sm text-gray-700 bg-blue-50 border border-blue-100 p-3 rounded">{selectedRecord.resolutionDescription}</p>
                  </div>
                )}

                {selectedRecord.remarks && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-500">Remarks: <span className="text-gray-700">{selectedRecord.remarks}</span></p>
                  </div>
                )}
              </div>

              {/* Right Column: Maintenance Timeline */}
              <div className="border-l border-gray-200 pl-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-1"><Clock size={16} /> Maintenance Timeline</h4>
                
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
                  {/* Created */}
                  <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-gov-blue rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                    <p className="text-sm font-medium text-gray-900">Request Created</p>
                    <p className="text-xs text-gray-500">{selectedRecord.requestDate}</p>
                  </div>
                  
                  {/* Assigned */}
                  {selectedRecord.assignedOperator && (
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                      <p className="text-sm font-medium text-gray-900">Operator Assigned</p>
                      <p className="text-xs text-gray-500">{selectedRecord.assignedOperator}</p>
                    </div>
                  )}

                  {/* Work Started */}
                  {selectedRecord.startDate && (
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-amber-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                      <p className="text-sm font-medium text-gray-900">Work Started</p>
                      <p className="text-xs text-gray-500">{selectedRecord.startDate}</p>
                    </div>
                  )}

                  {/* Completed */}
                  {selectedRecord.completionDate && (
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                      <p className="text-sm font-medium text-gray-900">Repair Completed</p>
                      <p className="text-xs text-gray-500">{selectedRecord.completionDate}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
              <Button onClick={() => { setIsViewModalOpen(false); handleOpenEditModal(selectedRecord); }}>Edit / Update</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Maintenance;
