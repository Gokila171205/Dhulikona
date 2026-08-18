import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { Search, Edit2, AlertCircle, Eye, Activity, RefreshCw, Calendar, Droplets, ListChecks, CheckCircle, XCircle } from 'lucide-react';
import { mockWaterSupply, frequencyList, statusList } from '../../data/mockWaterSupply';
import api from '../../services/api';

const WaterSupply = () => {
  const [supplyRecords, setSupplyRecords] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    village: '',
    supplyDate: '',
    scheduledStart: '',
    scheduledEnd: '',
    actualStart: '',
    actualEnd: '',
    frequency: 'Daily',
    status: 'Scheduled',
    remarks: ''
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const [supplyRes, villagesRes] = await Promise.all([
        api.get('/water-supply?limit=100'),
        api.get('/villages?limit=100')
      ]);
      setVillages(villagesRes.data);
      const mapped = supplyRes.data.map(r => ({
        id: r._id ? r._id.toString() : 'Unknown ID',
        village: r.village?.name || r.area || 'Unassigned / Missing',
        villageId: r.village?._id || '',
        supplyDate: r.supplyDate || r.date || 'Not recorded',
        scheduledStart: r.scheduledStart || r.startTime || 'Not recorded',
        scheduledEnd: r.scheduledEnd || r.endTime || 'Not recorded',
        actualStart: r.actualStart || 'Not recorded',
        actualEnd: r.actualEnd || 'Not recorded',
        frequency: r.frequency || 'Not recorded',
        status: r.status || 'Not recorded',
        remarks: r.remarks || '',
        recordedBy: r.recordedBy?.name || 'Not recorded',
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      }));
      setSupplyRecords(mapped);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch supply records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Filtered Records
  const filteredRecords = supplyRecords.filter(r => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      r.village.toLowerCase().includes(searchLower) || 
      r.id.toLowerCase().includes(searchLower);
    
    const matchesVillage = villageFilter ? r.villageId === villageFilter : true;
    const matchesDate = dateFilter ? r.supplyDate === dateFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    const matchesFrequency = frequencyFilter ? r.frequency === frequencyFilter : true;

    return matchesSearch && matchesVillage && matchesDate && matchesStatus && matchesFrequency;
  });

  // Summary Calculations
  const today = new Date().toISOString().split('T')[0]; // Simple mock today
  const totalRecords = supplyRecords.length;
  const villagesCovered = new Set(supplyRecords.map(r => r.village)).size;
  const todaysSupply = supplyRecords.filter(r => r.supplyDate === '2026-08-13').length; // using mock date as today
  const scheduledSupply = supplyRecords.filter(r => r.status === 'Scheduled').length;
  const completedSupply = supplyRecords.filter(r => r.status === 'Completed').length;
  const missedSupply = supplyRecords.filter(r => r.status === 'Missed').length;
  const cancelledSupply = supplyRecords.filter(r => r.status === 'Cancelled').length;

  const totalActionable = completedSupply + missedSupply;
  const reliability = totalActionable > 0 ? Math.round((completedSupply / totalActionable) * 100) : 0;

  // Chart Data preparation
  const statusData = [
    { name: 'Completed', value: completedSupply },
    { name: 'Missed', value: missedSupply },
    { name: 'Scheduled', value: scheduledSupply },
    { name: 'Cancelled', value: cancelledSupply }
  ].filter(d => d.value > 0);

  // Handlers
  const handleClearFilters = () => {
    setSearchTerm('');
    setVillageFilter('');
    setDateFilter('');
    setStatusFilter('');
    setFrequencyFilter('');
  };

  const handleOpenAddModal = () => {
    setSelectedRecord(null);
    setFormData({ 
      village: '', 
      supplyDate: new Date().toISOString().split('T')[0], 
      scheduledStart: '', 
      scheduledEnd: '', 
      actualStart: '', 
      actualEnd: '', 
      frequency: 'Daily', 
      status: 'Scheduled', 
      remarks: '' 
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setSelectedRecord(record);
    setFormData({ 
      village: record.villageId, 
      supplyDate: record.supplyDate, 
      scheduledStart: record.scheduledStart, 
      scheduledEnd: record.scheduledEnd, 
      actualStart: record.actualStart !== '-' ? record.actualStart : '', 
      actualEnd: record.actualEnd !== '-' ? record.actualEnd : '', 
      frequency: record.frequency, 
      status: record.status, 
      remarks: record.remarks 
    });
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (!formData.village) throw new Error('Please select a village.');

      const payload = {
        village: formData.village,
        supplyDate: formData.supplyDate,
        scheduledStart: formData.scheduledStart,
        scheduledEnd: formData.scheduledEnd,
        actualStart: formData.actualStart || '-',
        actualEnd: formData.actualEnd || '-',
        frequency: formData.frequency,
        status: formData.status,
        remarks: formData.remarks
      };

      if (selectedRecord) {
        await api.put(`/water-supply/${selectedRecord.id}`, payload);
      } else {
        await api.post('/water-supply', payload);
      }
      setIsFormModalOpen(false);
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save water supply record.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Missed': return 'danger';
      case 'Scheduled': return 'primary';
      case 'Cancelled': return 'default';
      default: return 'default';
    }
  };

  const calculateDuration = (start, end) => {
    if (!start || !end || start === '-' || end === '-' || start === 'Not recorded' || end === 'Not recorded') return '-';
    try {
      const sParts = start.split(':');
      const eParts = end.split(':');
      if (sParts.length !== 2 || eParts.length !== 2) return '-';
      const sh = Number(sParts[0]);
      const sm = Number(sParts[1]);
      const eh = Number(eParts[0]);
      const em = Number(eParts[1]);
      if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return '-';
      let diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff < 0) diff += 24 * 60; // handle crossing midnight
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return `${h}h ${m}m`;
    } catch {
      return '-';
    }
  };

  const columns = [
    { header: 'Supply Date', accessor: 'supplyDate' },
    { header: 'Village', accessor: 'village' },
    { 
      header: 'Scheduled Time', 
      render: (row) => {
        if (row.scheduledStart === 'Not recorded' && row.scheduledEnd === 'Not recorded') {
          return 'Not recorded';
        }
        return `${row.scheduledStart} - ${row.scheduledEnd}`;
      }
    },
    { 
      header: 'Actual Time', 
      render: (row) => {
        if ((row.actualStart === 'Not recorded' && row.actualEnd === 'Not recorded') || (row.actualStart === '-' && row.actualEnd === '-')) {
          return 'Not recorded';
        }
        return `${row.actualStart} - ${row.actualEnd}`;
      }
    },
    { header: 'Frequency', accessor: 'frequency' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
          {row.status}
        </Badge>
      )
    },
    { header: 'Recorded By', accessor: 'recordedBy' },
    { header: 'Remarks', accessor: 'remarks' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-3">
          <button onClick={() => handleOpenViewModal(row)} className="text-gray-500 hover:text-gov-blue" title="View Details">
            <Eye size={18} />
          </button>
          <button onClick={() => handleOpenEditModal(row)} className="text-gray-500 hover:text-gov-blue" title="Edit">
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
        <span className="ml-2 text-gray-600">Loading supply records...</span>
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
          <h2 className="text-2xl font-bold text-gray-800">Water Supply Management</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor drinking-water supply schedules, frequency and service performance across registered villages.</p>
        </div>
        <Button onClick={handleOpenAddModal} className="flex items-center gap-2 whitespace-nowrap">
          <ListChecks size={18} /> Add Supply Record
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card className="p-3 text-center bg-gray-50 border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase">Total Records</p>
          <h3 className="text-xl font-bold text-gray-900 mt-1">{totalRecords}</h3>
        </Card>
        <Card className="p-3 text-center bg-indigo-50 border-indigo-200">
          <p className="text-xs font-medium text-indigo-700 uppercase">Villages Covered</p>
          <h3 className="text-xl font-bold text-indigo-900 mt-1">{villagesCovered}</h3>
        </Card>
        <Card className="p-3 text-center bg-blue-50 border-blue-200">
          <p className="text-xs font-medium text-blue-700 uppercase">Today's Supply</p>
          <h3 className="text-xl font-bold text-blue-900 mt-1">{todaysSupply}</h3>
        </Card>
        <Card className="p-3 text-center bg-purple-50 border-purple-200">
          <p className="text-xs font-medium text-purple-700 uppercase">Scheduled</p>
          <h3 className="text-xl font-bold text-purple-900 mt-1">{scheduledSupply}</h3>
        </Card>
        <Card className="p-3 text-center bg-green-50 border-green-200">
          <p className="text-xs font-medium text-green-700 uppercase">Completed</p>
          <h3 className="text-xl font-bold text-green-900 mt-1">{completedSupply}</h3>
        </Card>
        <Card className="p-3 text-center bg-red-50 border-red-200">
          <p className="text-xs font-medium text-red-700 uppercase">Missed</p>
          <h3 className="text-xl font-bold text-red-900 mt-1">{missedSupply}</h3>
        </Card>
        <Card className="p-3 text-center bg-teal-50 border-teal-200">
          <p className="text-xs font-medium text-teal-700 uppercase">Reliability</p>
          <h3 className="text-xl font-bold text-teal-900 mt-1">{reliability}%</h3>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Supply Performance Overview</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
             {/* Simple BarChart integration utilizing existing wrappers or mock display */}
             <BarChart 
                data={statusData} 
                xKey="name" 
                yKey="value"
                colors={['#10b981', '#ef4444', '#3b82f6', '#9ca3af']} 
             />
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Distribution</h3>
          <div className="h-64 flex items-center justify-center">
             <PieChart 
                data={statusData}
                colors={['#10b981', '#ef4444', '#3b82f6', '#9ca3af']}
             />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <Input 
              placeholder="Search by ID or Village..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            options={[
              { label: 'All Villages', value: '' },
              ...villages.map(v => ({ label: v.name, value: v._id }))
            ]}
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
          />

          <Input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />

          <Select
            options={[
              { label: 'All Statuses', value: '' },
              ...statusList.map(s => ({ label: s, value: s }))
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />

          <Select
            options={[
              { label: 'All Frequencies', value: '' },
              ...frequencyList.map(f => ({ label: f, value: f }))
            ]}
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
          />
        </div>
        
        {/* Clear Filters Button */}
        {(searchTerm || villageFilter || dateFilter || statusFilter || frequencyFilter) && (
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
        <Table columns={columns} data={filteredRecords} keyExtractor={row => row.id} />
      </Card>

      {/* Form Modal (Add/Edit) */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title={selectedRecord ? 'Edit Supply Record' : 'Add Supply Record'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Village" 
              required
              options={[
                { label: 'Select Village...', value: '' },
                ...villages.map(v => ({ label: v.name, value: v._id }))
              ]}
              value={formData.village}
              onChange={(e) => setFormData({...formData, village: e.target.value})}
            />
            <Input 
              label="Supply Date" 
              type="date"
              required 
              value={formData.supplyDate}
              onChange={(e) => setFormData({...formData, supplyDate: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Scheduled Start" 
              type="time"
              required 
              value={formData.scheduledStart}
              onChange={(e) => setFormData({...formData, scheduledStart: e.target.value})}
            />
            <Input 
              label="Scheduled End" 
              type="time"
              required 
              value={formData.scheduledEnd}
              onChange={(e) => setFormData({...formData, scheduledEnd: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Actual Start (optional)" 
              type="time"
              value={formData.actualStart}
              onChange={(e) => setFormData({...formData, actualStart: e.target.value})}
            />
            <Input 
              label="Actual End (optional)" 
              type="time"
              value={formData.actualEnd}
              onChange={(e) => setFormData({...formData, actualEnd: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Frequency" 
              required
              options={frequencyList.map(f => ({ label: f, value: f }))}
              value={formData.frequency}
              onChange={(e) => setFormData({...formData, frequency: e.target.value})}
            />
            <Select 
              label="Status" 
              required
              options={statusList.map(s => ({ label: s, value: s }))}
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gov-blue focus:border-gov-blue"
              rows="2"
              value={formData.remarks}
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
              placeholder="Any operational notes..."
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

      {/* View Details Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        title="Supply Record Details"
        className="max-w-2xl"
      >
        {selectedRecord && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Record: {selectedRecord.id}</h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  Village: <span className="font-medium text-gray-800">{selectedRecord.village}</span> | Date: {selectedRecord.supplyDate}
                </p>
              </div>
              <Badge variant={getStatusBadgeVariant(selectedRecord.status)}>
                {selectedRecord.status}
              </Badge>
            </div>

            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <Calendar size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Scheduled Duration</span>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {calculateDuration(selectedRecord.scheduledStart, selectedRecord.scheduledEnd)}
                </p>
                <p className="text-xs text-blue-600 mt-1">{selectedRecord.scheduledStart} - {selectedRecord.scheduledEnd}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <Activity size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Actual Duration</span>
                </div>
                <p className="text-lg font-bold text-green-900">
                  {calculateDuration(selectedRecord.actualStart, selectedRecord.actualEnd)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {selectedRecord.actualStart !== '-' ? `${selectedRecord.actualStart} - ${selectedRecord.actualEnd}` : 'Not recorded'}
                </p>
              </div>
              <div className={`${getStatusBadgeVariant(selectedRecord.status) === 'success' ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-gray-50 border-gray-200 text-gray-700'} p-3 rounded-lg border`}>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Performance</span>
                </div>
                <p className="text-lg font-bold">{selectedRecord.status}</p>
                <p className="text-xs mt-1">{selectedRecord.frequency}</p>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm border-t border-gray-100 pt-4">
              {selectedRecord.id && (
                <div className="flex justify-between border-b border-dashed pb-1">
                  <span className="text-gray-500">Record ID</span>
                  <span className="font-medium text-gray-800">{selectedRecord.id}</span>
                </div>
              )}
              {selectedRecord.village && (
                <div className="flex justify-between border-b border-dashed pb-1">
                  <span className="text-gray-500">Village</span>
                  <span className="font-medium text-gray-800">{selectedRecord.village}</span>
                </div>
              )}
              {selectedRecord.supplyDate && (
                <div className="flex justify-between border-b border-dashed pb-1">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-800">{selectedRecord.supplyDate}</span>
                </div>
              )}
              {selectedRecord.scheduledStart && (
                <div className="flex justify-between border-b border-dashed pb-1">
                  <span className="text-gray-500">Scheduled Start</span>
                  <span className="font-medium text-gray-800">{selectedRecord.scheduledStart}</span>
                </div>
              )}
              {selectedRecord.scheduledEnd && (
                <div className="flex justify-between border-b border-dashed pb-1">
                  <span className="text-gray-500">Scheduled End</span>
                  <span className="font-medium text-gray-800">{selectedRecord.scheduledEnd}</span>
                </div>
              )}
              {selectedRecord.actualStart && (
                <div className="flex justify-between border-b border-dashed pb-1">
                  <span className="text-gray-500">Actual Start</span>
                  <span className="font-medium text-gray-800">{selectedRecord.actualStart}</span>
                </div>
              )}
              {selectedRecord.actualEnd && (
                <div className="flex justify-between border-b border-dashed pb-1">
                  <span className="text-gray-500">Actual End</span>
                  <span className="font-medium text-gray-800">{selectedRecord.actualEnd}</span>
                </div>
              )}
              {selectedRecord.frequency && (
                <div className="flex justify-between border-b border-dashed pb-1">
                  <span className="text-gray-500">Frequency</span>
                  <span className="font-medium text-gray-800">{selectedRecord.frequency}</span>
                </div>
              )}
              {selectedRecord.status && (
                <div className="flex justify-between border-b border-dashed pb-1">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium text-gray-800">{selectedRecord.status}</span>
                </div>
              )}
              {selectedRecord.recordedBy && (
                <div className="flex justify-between border-b border-dashed pb-1">
                  <span className="text-gray-500">Recorded By</span>
                  <span className="font-medium text-gov-blue">{selectedRecord.recordedBy}</span>
                </div>
              )}
              {selectedRecord.createdAt && (
                <div className="flex justify-between border-b border-dashed pb-1">
                  <span className="text-gray-500">Created At</span>
                  <span className="font-medium text-gray-600">{new Date(selectedRecord.createdAt).toLocaleString()}</span>
                </div>
              )}
              {selectedRecord.updatedAt && (
                <div className="flex justify-between border-b border-dashed pb-1">
                  <span className="text-gray-500">Updated At</span>
                  <span className="font-medium text-gray-600">{new Date(selectedRecord.updatedAt).toLocaleString()}</span>
                </div>
              )}
              <div className="col-span-2 mt-2">
                <span className="text-gray-500 block mb-1">Remarks</span>
                <div className="bg-gray-50 p-3 rounded text-gray-700 border border-gray-200 min-h-[3rem]">
                  {selectedRecord.remarks || <span className="text-gray-400 italic">No remarks provided.</span>}
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end border-t border-gray-100">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WaterSupply;
