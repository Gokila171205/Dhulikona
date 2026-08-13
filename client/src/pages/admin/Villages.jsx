import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { Search, Plus, Edit2, AlertCircle, Eye, Home, Wrench, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { mockVillages, districtsList, operatorsList } from '../../data/mockVillages';

const Villages = () => {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    district: '',
    block: '',
    households: '',
    operator: '',
    status: 'Active'
  });

  // Fetch villages (mock API call)
  useEffect(() => {
    const fetchVillages = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        setVillages(mockVillages);
        setError(null);
      } catch (err) {
        setError('Failed to fetch villages. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchVillages();
  }, []);

  // Filtered Villages
  const filteredVillages = villages.filter(v => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      v.name.toLowerCase().includes(searchLower) || 
      v.id.toLowerCase().includes(searchLower) ||
      v.district.toLowerCase().includes(searchLower);
    
    const matchesDistrict = districtFilter ? v.district === districtFilter : true;
    const matchesStatus = statusFilter ? v.status === statusFilter : true;
    const matchesOperator = operatorFilter ? v.operator === operatorFilter : true;

    return matchesSearch && matchesDistrict && matchesStatus && matchesOperator;
  });

  // Handlers
  const handleClearFilters = () => {
    setSearchTerm('');
    setDistrictFilter('');
    setStatusFilter('');
    setOperatorFilter('');
  };

  const handleOpenAddModal = () => {
    setSelectedVillage(null);
    setFormData({ name: '', district: '', block: '', households: '', operator: '', status: 'Active' });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (village) => {
    setSelectedVillage(village);
    setFormData({ 
      name: village.name, 
      district: village.district, 
      block: village.block, 
      households: village.households, 
      operator: village.operator,
      status: village.status 
    });
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (village) => {
    setSelectedVillage(village);
    setIsViewModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedVillage) {
      // Edit
      setVillages(villages.map(v => v.id === selectedVillage.id ? { ...v, ...formData } : v));
    } else {
      // Add
      const newVillage = {
        id: `VLG-${2000 + villages.length + 1}`,
        ...formData,
        population: parseInt(formData.households) * 4.5, // Mock estimation
        pumps: 0,
        workingPumps: 0,
        pendingComplaints: 0,
        waterSupplyStatus: 'Pending setup'
      };
      setVillages([newVillage, ...villages]);
    }
    setIsFormModalOpen(false);
  };

  const columns = [
    { header: 'Village ID', accessor: 'id' },
    { header: 'Village Name', accessor: 'name' },
    { header: 'District', accessor: 'district' },
    { header: 'Block', accessor: 'block' },
    { header: 'Households', accessor: 'households' },
    { header: 'Pumps', accessor: 'pumps' },
    { header: 'Assigned Operator', accessor: 'operator' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'danger'}>
          {row.status}
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
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />

          <Select
            options={[
              { label: 'All Operators', value: '' },
              ...operatorsList.map(o => ({ label: o.name, value: o.name }))
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
        <Table columns={columns} data={filteredVillages} keyExtractor={row => row.id} />
      </Card>

      {/* Form Modal (Add/Edit) */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title={selectedVillage ? 'Edit Village' : 'Add New Village'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input 
            label="Village Name" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Select 
            label="District" 
            required
            options={[
              { label: 'Select District...', value: '' },
              ...districtsList.map(d => ({ label: d, value: d }))
            ]}
            value={formData.district}
            onChange={(e) => setFormData({...formData, district: e.target.value})}
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
              ...operatorsList.map(o => ({ label: o.name, value: o.name }))
            ]}
            value={formData.operator}
            onChange={(e) => setFormData({...formData, operator: e.target.value})}
          />
          <Select 
            label="Status" 
            required
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          />
          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button variant="outline" type="button" onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
            <Button 
              type="submit"
              disabled={!formData.name || !formData.district || !formData.block || !formData.households || !formData.operator}
            >
              {selectedVillage ? 'Save Changes' : 'Add Village'}
            </Button>
          </div>
        </form>
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
              <Badge variant={selectedVillage.status === 'Active' ? 'success' : 'danger'}>
                {selectedVillage.status}
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
                <span className="font-medium text-gray-900">{selectedVillage.id}</span>
              </div>
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Population (Est.)</span>
                <span className="font-medium text-gray-900">{selectedVillage.population}</span>
              </div>
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Assigned Operator</span>
                <span className="font-medium text-gov-blue">{selectedVillage.operator}</span>
              </div>
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Water Supply</span>
                <span className={`font-medium ${selectedVillage.waterSupplyStatus === 'Normal' || selectedVillage.waterSupplyStatus === 'Excellent' ? 'text-green-600' : 'text-amber-600'}`}>
                  {selectedVillage.waterSupplyStatus}
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
