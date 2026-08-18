import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { Search, Plus, Edit2, AlertCircle, Eye, Home, Wrench, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const Villages = () => {
  const [villages, setVillages] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [operatorsList, setOperatorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVillages, setTotalVillages] = useState(0);
  const limit = 10;
  
  // Form State
  const [formData, setFormData] = useState({
    villageId: '',
    name: '',
    district: '',
    block: '',
    households: '',
    operator: '',
    status: 'active'
  });

  // Fetch initial metadata like operators list and all unique districts
  const fetchMetadata = async () => {
    try {
      const [allVillagesRes, operatorsRes] = await Promise.all([
        api.get('/villages', { params: { limit: 1000 } }),
        api.get('/users', { params: { role: 'operator', limit: 100 } })
      ]);
      const uniqueDistricts = [...new Set(allVillagesRes.data.map(v => v.district))];
      setDistrictsList(uniqueDistricts);
      setOperatorsList(operatorsRes.data);
    } catch (err) {
      console.error('Failed to fetch metadata:', err);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const villagesRes = await api.get('/villages', {
        params: {
          search: searchTerm,
          district: districtFilter,
          status: statusFilter,
          operator: operatorFilter,
          page,
          limit
        }
      });
      setVillages(villagesRes.data);
      setTotalPages(villagesRes.pagination?.totalPages || 1);
      setTotalVillages(villagesRes.pagination?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch villages.');
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 1 when filters change to prevent empty states
  useEffect(() => {
    setPage(1);
  }, [searchTerm, districtFilter, statusFilter, operatorFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, districtFilter, statusFilter, operatorFilter, page]);

  // Frontend filtering is bypassed as backend handles it, but kept as a passthrough for Table.
  const filteredVillages = villages;

  // Handlers
  const handleClearFilters = () => {
    setSearchTerm('');
    setDistrictFilter('');
    setStatusFilter('');
    setOperatorFilter('');
  };

  const handleOpenAddModal = () => {
    setSelectedVillage(null);
    setFormData({ villageId: '', name: '', district: '', block: '', households: '', operator: '', status: 'active' });
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (village) => {
    setSelectedVillage(village);
    setFormData({ 
      villageId: village.villageId,
      name: village.name, 
      district: village.district, 
      block: village.block, 
      households: village.households, 
      operator: village.assignedOperator?._id || village.assignedOperator || '',
      status: village.status 
    });
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = async (village) => {
    try {
      setLoading(true);
      const res = await api.get(`/villages/${village._id || village.id}`);
      setSelectedVillage(res.data);
      setIsViewModalOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch village details.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusConfirm = (village) => {
    setSelectedVillage(village);
    setIsConfirmModalOpen(true);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      const payload = {
        villageId: formData.villageId,
        name: formData.name,
        district: formData.district,
        block: formData.block,
        households: Number(formData.households) || 0,
        status: formData.status
      };
      
      // Only include assignedOperator if it has a valid selected value, or clear it if empty
      payload.assignedOperator = formData.operator || null;

      if (selectedVillage) {
        await api.put(`/villages/${selectedVillage._id || selectedVillage.id}`, payload);
        showSuccess('Village updated successfully!');
      } else {
        await api.post('/villages', payload);
        showSuccess('Village created successfully!');
      }
      setIsFormModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save village.');
    }
  };

  const handleToggleStatus = async () => {
    try {
      await api.patch(`/villages/${selectedVillage._id || selectedVillage.id}/status`, {
        status: selectedVillage.status === 'active' ? 'inactive' : 'active'
      });
      showSuccess(`Village ${selectedVillage.status === 'active' ? 'deactivated' : 'activated'} successfully!`);
      setIsConfirmModalOpen(false);
      fetchData(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change status.');
    }
  };

  const columns = [
    { header: 'Village ID', accessor: 'villageId' },
    { header: 'Village Name', accessor: 'name' },
    { header: 'District', accessor: 'district' },
    { header: 'Block', accessor: 'block' },
    { header: 'Households', accessor: 'households' },
    { 
      header: 'Assigned Operator', 
      accessor: 'assignedOperator',
      render: (row) => row.assignedOperator?.name || 'Unassigned'
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'danger'}>
          {row.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
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
          <button 
            onClick={() => handleOpenStatusConfirm(row)} 
            className={`${row.status === 'active' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} text-xs font-medium border px-2 py-1 rounded`}
          >
            {row.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
        <span className="ml-2 text-gray-600">Loading villages...</span>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Village Management</h2>
          <p className="text-gray-500 text-sm">Administrators can monitor and manage rural water-service information for registered villages.</p>
        </div>
        <Button onClick={handleOpenAddModal} className="flex items-center gap-2 whitespace-nowrap">
          <Plus size={18} /> Add Village
        </Button>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 text-green-700 rounded-md flex items-center gap-2 border border-green-100 transition-all">
          <CheckCircle size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="relative lg:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <Input 
              placeholder="Search by village name, ID, or district..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            options={[
              { label: 'All Districts', value: '' },
              ...districtsList.map(d => ({ label: d, value: d }))
            ]}
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          />

          <Select
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />

          <Select
            options={[
              { label: 'All Operators', value: '' },
              ...operatorsList.map(o => ({ label: o.name, value: o._id }))
            ]}
            value={operatorFilter}
            onChange={(e) => setOperatorFilter(e.target.value)}
          />
        </div>
        
        {/* Clear Filters Button */}
        {(searchTerm || districtFilter || statusFilter || operatorFilter) && (
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

      {/* Villages Table */}
      <Card className="overflow-hidden">
        <Table columns={columns} data={filteredVillages} keyExtractor={row => row._id || row.id} />
        
        {/* Pagination Controls */}
        {totalVillages > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 border-t border-gray-150">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * limit, totalVillages)}</span> of{' '}
              <span className="font-medium">{totalVillages}</span> villages
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="!px-3 !py-1.5 text-sm bg-white"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 font-medium px-2">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="!px-3 !py-1.5 text-sm bg-white"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Form Modal (Add/Edit) */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title={selectedVillage ? 'Edit Village' : 'Add New Village'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
              {formError}
            </div>
          )}
          
          <Input 
            label="Village ID" 
            required 
            disabled={!!selectedVillage}
            value={formData.villageId}
            onChange={(e) => setFormData({...formData, villageId: e.target.value})}
            placeholder="e.g. V-001"
          />
          <Input 
            label="Village Name" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="District" 
            required 
            value={formData.district}
            onChange={(e) => setFormData({...formData, district: e.target.value})}
            placeholder="e.g. Kamrup"
          />
          <Input 
            label="Block" 
            required 
            value={formData.block}
            onChange={(e) => setFormData({...formData, block: e.target.value})}
          />
          <Input 
            label="Number of Households" 
            type="number"
            required 
            min="1"
            value={formData.households}
            onChange={(e) => setFormData({...formData, households: e.target.value})}
          />
          <Select 
            label="Assigned Operator" 
            required
            options={[
              { label: 'Select Operator...', value: '' },
              ...operatorsList.map(o => ({ label: o.name, value: o._id }))
            ]}
            value={formData.operator}
            onChange={(e) => setFormData({...formData, operator: e.target.value})}
          />
          <Select 
            label="Status" 
            required
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          />
          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button variant="outline" type="button" onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
            <Button 
              type="submit"
              disabled={!formData.villageId || !formData.name || !formData.district || !formData.block}
            >
              {selectedVillage ? 'Save Changes' : 'Add Village'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Status Confirmation Modal */}
      <Modal 
        isOpen={isConfirmModalOpen} 
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Action"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-warning/10 text-warning rounded-md">
            <AlertCircle className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              Are you sure you want to <strong>{selectedVillage?.status === 'active' ? 'deactivate' : 'activate'}</strong> the village <strong>{selectedVillage?.name}</strong>?
            </p>
          </div>
          <p className="text-sm text-gray-600">
            {selectedVillage?.status === 'active'
              ? "Deactivating this village will set its status to inactive. Villagers and operators associated with this village may see service notices."
              : "Activating this village will restore its status to active."
            }
          </p>
          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
            <Button variant={selectedVillage?.status === 'active' ? 'danger' : 'primary'} onClick={handleToggleStatus}>
              Yes, {selectedVillage?.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        title="Village Details"
        className="max-w-2xl"
      >
        {selectedVillage && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedVillage.name}</h3>
                <p className="text-sm text-gray-500">{selectedVillage.block}, {selectedVillage.district}</p>
              </div>
              <Badge variant={selectedVillage.status?.toLowerCase() === 'active' ? 'success' : 'danger'}>
                {selectedVillage.status?.toUpperCase()}
              </Badge>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-2 text-indigo-700 mb-1">
                  <Home size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Households</span>
                </div>
                <p className="text-xl font-bold text-indigo-900">{selectedVillage.households}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Wrench size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Total Pumps</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{selectedVillage.pumps}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <CheckCircle size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Working</span>
                </div>
                <p className="text-xl font-bold text-green-900">{selectedVillage.workingPumps}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 mb-1">
                  <AlertTriangle size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Complaints</span>
                </div>
                <p className="text-xl font-bold text-amber-900">{selectedVillage.pendingComplaints}</p>
              </div>
            </div>

            {/* Detailed Info List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Village ID</span>
                <span className="font-medium text-gray-900">{selectedVillage.villageId}</span>
              </div>
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Population (Est.)</span>
                <span className="font-medium text-gray-900">{selectedVillage.households * 4.5}</span>
              </div>
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Assigned Operator</span>
                <span className="font-medium text-gov-blue">{selectedVillage.assignedOperator?.name || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Water Supply</span>
                <span className={`font-medium ${selectedVillage.waterSupplyStatus === 'Normal' || selectedVillage.waterSupplyStatus === 'Excellent' ? 'text-green-600' : 'text-amber-600'}`}>
                  {selectedVillage.waterSupplyStatus || 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="pt-2 flex justify-end">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Villages;
