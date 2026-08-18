import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { Search, Edit2, AlertCircle, Eye, Wrench, Settings, XCircle, Slash, RefreshCw, ClipboardList, Calendar, MapPin, CheckCircle, Activity } from 'lucide-react';
import { mockPumps, pumpTypes } from '../../data/mockPumps';
import { operatorsList } from '../../data/mockVillages';
import api from '../../services/api';

const Pumps = () => {
  const [pumps, setPumps] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPump, setSelectedPump] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    village: '',
    pumpType: '',
    installationDate: '',
    status: 'Working',
    operator: ''
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const [pumpsRes, villagesRes] = await Promise.all([
        api.get('/pumps?limit=100'),
        api.get('/villages?limit=100')
      ]);
      setVillages(villagesRes.data);
      const mapped = pumpsRes.data.map(p => ({
        id: p._id.toString(),
        name: p.name,
        village: p.village?.name || 'Unknown',
        villageId: p.village?._id || '',
        pumpType: p.type || 'Submersible',
        installationDate: p.installationDate ? p.installationDate.split('T')[0] : '',
        lastMaintenance: p.lastMaintenanceDate ? p.lastMaintenanceDate.split('T')[0] : 'None',
        status: p.status,
        operator: p.village?.assignedOperator?.name || 'Unassigned'
      }));
      setPumps(mapped);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pumps.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Filtered Pumps
  const filteredPumps = pumps.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(searchLower) || 
      p.id.toLowerCase().includes(searchLower) ||
      p.village.toLowerCase().includes(searchLower);
    
    const matchesVillage = villageFilter ? p.village === villageFilter : true;
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    const matchesType = typeFilter ? p.pumpType === typeFilter : true;

    return matchesSearch && matchesVillage && matchesStatus && matchesType;
  });

  // Summary Data
  const summaryCards = [
    { title: 'Total Pumps', value: pumps.length, icon: Wrench, color: 'text-indigo-600', bg: 'bg-indigo-600/10' },
    { title: 'Working', value: pumps.filter(p => p.status === 'Working').length, icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Under Maintenance', value: pumps.filter(p => p.status === 'Under Maintenance').length, icon: Settings, color: 'text-warning', bg: 'bg-warning/10' },
    { title: 'Not Working', value: pumps.filter(p => p.status === 'Not Working').length, icon: XCircle, color: 'text-danger', bg: 'bg-danger/10' },
    { title: 'Unavailable', value: pumps.filter(p => p.status === 'Unavailable').length, icon: Slash, color: 'text-gray-500', bg: 'bg-gray-100' },
  ];

  // Handlers
  const handleClearFilters = () => {
    setSearchTerm('');
    setVillageFilter('');
    setStatusFilter('');
    setTypeFilter('');
  };

  const handleOpenEditModal = (pump) => {
    setSelectedPump(pump);
    setFormData({ 
      name: pump.name, 
      village: pump.village, 
      pumpType: pump.pumpType, 
      installationDate: pump.installationDate, 
      status: pump.status,
      operator: pump.operator
    });
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (pump) => {
    setSelectedPump(pump);
    setIsViewModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const vDoc = villages.find(v => v.name === formData.village);
      if (!vDoc) throw new Error('Selected village name is invalid.');

      const payload = {
        name: formData.name,
        village: vDoc._id,
        type: formData.pumpType,
        installationDate: formData.installationDate,
        status: formData.status
      };

      await api.put(`/pumps/${selectedPump.id}`, payload);
      setIsFormModalOpen(false);
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update pump details.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Working': return 'success';
      case 'Under Maintenance': return 'warning';
      case 'Not Working': return 'danger';
      case 'Unavailable': return 'default';
      default: return 'default';
    }
  };

  const columns = [
    { header: 'Pump Name', accessor: 'name' },
    { header: 'Village', accessor: 'village' },
    { header: 'Pump Type', accessor: 'pumpType' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
          {row.status}
        </Badge>
      )
    },
    { header: 'Last Maintenance', accessor: 'lastMaintenance' },
    { header: 'Assigned Operator', accessor: 'operator' },
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
        <span className="ml-2 text-gray-600">Loading pumps...</span>
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
          <h2 className="text-2xl font-bold text-gray-800">Pump Management</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor pump operation, availability and maintenance status across all registered villages.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {summaryCards.map((item, index) => (
          <Card key={index} className="p-4 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-full mb-3 ${item.bg} ${item.color}`}>
              <item.icon size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{item.value}</h3>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">{item.title}</p>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="relative lg:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <Input 
              placeholder="Search by pump ID, name, or village..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            options={[
              { label: 'All Villages', value: '' },
              ...villages.map(v => ({ label: v.name, value: v.name }))
            ]}
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
          />

          <Select
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Working', value: 'Working' },
              { label: 'Under Maintenance', value: 'Under Maintenance' },
              { label: 'Not Working', value: 'Not Working' },
              { label: 'Unavailable', value: 'Unavailable' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />

          <Select
            options={[
              { label: 'All Types', value: '' },
              ...pumpTypes.map(t => ({ label: t, value: t }))
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
        </div>
        
        {/* Clear Filters Button */}
        {(searchTerm || villageFilter || statusFilter || typeFilter) && (
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

      {/* Pumps Table */}
      <Card className="overflow-hidden">
        <Table columns={columns} data={filteredPumps} keyExtractor={row => row.id} />
      </Card>

      {/* Form Modal (Edit) */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title="Edit Pump Details"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input 
            label="Pump Name" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Select 
            label="Village" 
            required
            options={[
              { label: 'Select Village...', value: '' },
              ...villages.map(v => ({ label: v.name, value: v.name }))
            ]}
            value={formData.village}
            onChange={(e) => setFormData({...formData, village: e.target.value})}
          />
          <Select 
            label="Pump Type" 
            required
            options={[
              { label: 'Select Type...', value: '' },
              ...pumpTypes.map(t => ({ label: t, value: t }))
            ]}
            value={formData.pumpType}
            onChange={(e) => setFormData({...formData, pumpType: e.target.value})}
          />
          <Input 
            label="Installation Date" 
            type="date"
            required 
            value={formData.installationDate}
            onChange={(e) => setFormData({...formData, installationDate: e.target.value})}
          />
          <Select 
            label="Current Status" 
            required
            options={[
              { label: 'Working', value: 'Working' },
              { label: 'Under Maintenance', value: 'Under Maintenance' },
              { label: 'Not Working', value: 'Not Working' },
              { label: 'Unavailable', value: 'Unavailable' },
            ]}
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          />
          <Select 
            label="Assigned Operator" 
            required
            options={[
              { label: 'Select Operator...', value: '' },
              ...operatorsList.map(o => ({ label: o.name, value: o.name }))
            ]}
            value={formData.operator}
            onChange={(e) => setFormData({...formData, operator: e.target.value})}
          />
          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button variant="outline" type="button" onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        title="Pump Details"
        className="max-w-2xl"
      >
        {selectedPump && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedPump.name}</h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin size={14} /> {selectedPump.village} | ID: {selectedPump.id}
                </p>
              </div>
              <Badge variant={getStatusBadgeVariant(selectedPump.status)}>
                {selectedPump.status}
              </Badge>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <ClipboardList size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Maintenance Records</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{selectedPump.maintenanceHistory.length}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Last Maintenance</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{selectedPump.lastMaintenance || 'None'}</p>
              </div>
              <div className={`${getStatusBadgeVariant(selectedPump.status) === 'success' ? 'bg-green-50 border-green-200 text-green-700' : getStatusBadgeVariant(selectedPump.status) === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' : getStatusBadgeVariant(selectedPump.status) === 'danger' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-700'} p-3 rounded-lg border`}>
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Current Status</span>
                </div>
                <p className="text-lg font-bold">{selectedPump.status}</p>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Pump Type</span>
                <span className="font-medium text-gray-900">{selectedPump.pumpType}</span>
              </div>
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Installation Date</span>
                <span className="font-medium text-gray-900">{selectedPump.installationDate}</span>
              </div>
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Assigned Operator</span>
                <span className="font-medium text-gov-blue">{selectedPump.operator}</span>
              </div>
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Last Updated Record</span>
                <span className="font-medium text-gray-600">{new Date(selectedPump.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Maintenance History */}
            {selectedPump.maintenanceHistory.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Recent Maintenance History</h4>
                <div className="space-y-3">
                  {selectedPump.maintenanceHistory.map((history, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{history.issue}</p>
                        <p className="text-xs text-gray-500 mt-1">Handled by: {history.handledBy}</p>
                      </div>
                      <span className="text-xs font-medium text-gray-500">{history.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4 flex justify-end border-t border-gray-100">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Pumps;
