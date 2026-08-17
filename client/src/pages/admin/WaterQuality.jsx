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
import { Search, Edit2, AlertCircle, Eye, RefreshCw, CheckCircle, AlertTriangle, XCircle, Droplet, Plus } from 'lucide-react';
import { mockWaterQuality, waterQualityStatusList } from '../../data/mockWaterQuality';
import api from '../../services/api';

const WaterQuality = () => {
  const [qualityRecords, setQualityRecords] = useState([]);
  const [villages, setVillages] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operatorLoading, setOperatorLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [testerFilter, setTesterFilter] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    village: '',
    testDate: '',
    testedBy: '',
    ph: '',
    turbidity: '',
    tds: '',
    chlorine: '',
    status: 'Safe',
    remarks: ''
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setOperatorLoading(true);
      const [qualityRes, villagesRes, operatorsRes] = await Promise.all([
        api.get('/water-quality?limit=100'),
        api.get('/villages?limit=100'),
        api.get('/users?role=operator&limit=100')
      ]);
      setVillages(villagesRes.data);
      setOperators(operatorsRes.data);
      const mapped = qualityRes.data.map(r => ({
        id: r._id.toString(),
        village: r.village?.name || 'Unknown',
        villageId: r.village?._id || '',
        testDate: r.testDate,
        ph: r.ph,
        tds: r.tds,
        turbidity: r.turbidity,
        chlorine: r.chlorine,
        status: r.status,
        remarks: r.remarks || '',
        testedBy: r.recordedBy?.name || 'Operator'
      }));
      setQualityRecords(mapped);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch water quality records.');
    } finally {
      setLoading(false);
      setOperatorLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Filtered Records
  const filteredRecords = qualityRecords.filter(r => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      r.village.toLowerCase().includes(searchLower) || 
      r.id.toLowerCase().includes(searchLower);
    
    const matchesVillage = villageFilter ? r.village === villageFilter : true;
    const matchesDate = dateFilter ? r.testDate === dateFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    const matchesTester = testerFilter ? r.testedBy === testerFilter : true;

    return matchesSearch && matchesVillage && matchesDate && matchesStatus && matchesTester;
  });

  // Summary Calculations
  const totalTests = qualityRecords.length;
  const villagesTested = new Set(qualityRecords.map(r => r.village)).size;
  const safeTests = qualityRecords.filter(r => r.status === 'Safe').length;
  const needsAttentionTests = qualityRecords.filter(r => r.status === 'Needs Attention').length;
  const criticalTests = qualityRecords.filter(r => r.status === 'Critical').length;

  // Chart Data
  const statusData = [
    { name: 'Safe', value: safeTests },
    { name: 'Needs Attention', value: needsAttentionTests },
    { name: 'Critical', value: criticalTests }
  ].filter(d => d.value > 0);

  // Handlers
  const handleClearFilters = () => {
    setSearchTerm('');
    setVillageFilter('');
    setDateFilter('');
    setStatusFilter('');
    setTesterFilter('');
  };

  const handleOpenAddModal = () => {
    setSelectedRecord(null);
    setFormData({ 
      village: '', 
      testDate: new Date().toISOString().split('T')[0], 
      testedBy: '', 
      ph: '', 
      turbidity: '', 
      tds: '', 
      chlorine: '', 
      status: 'Safe', 
      remarks: '' 
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setSelectedRecord(record);
    setFormData({ 
      village: record.village, 
      testDate: record.testDate, 
      testedBy: record.testedBy, 
      ph: record.ph, 
      turbidity: record.turbidity, 
      tds: record.tds, 
      chlorine: record.chlorine, 
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
      const vDoc = villages.find(v => v.name === formData.village);
      if (!vDoc) throw new Error('Selected village name is invalid.');

      const payload = {
        village: vDoc._id,
        testDate: formData.testDate,
        ph: Number(formData.ph),
        tds: Number(formData.tds),
        turbidity: Number(formData.turbidity),
        chlorine: Number(formData.chlorine),
        status: formData.status,
        remarks: formData.remarks
      };

      if (selectedRecord) {
        await api.put(`/water-quality/${selectedRecord.id}`, payload);
      } else {
        await api.post('/water-quality', payload);
      }
      setIsFormModalOpen(false);
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save water quality test.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Safe': return 'success';
      case 'Needs Attention': return 'warning';
      case 'Critical': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    { header: 'Test ID', accessor: 'id' },
    { header: 'Village', accessor: 'village' },
    { header: 'Date', accessor: 'testDate' },
    { header: 'Tested By', accessor: 'testedBy' },
    { header: 'pH', accessor: 'ph' },
    { header: 'Turbidity', accessor: 'turbidity' },
    { header: 'TDS (mg/L)', accessor: 'tds' },
    { header: 'Chlorine', accessor: 'chlorine' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
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
        <span className="ml-2 text-gray-600">Loading quality records...</span>
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
          <h2 className="text-2xl font-bold text-gray-800">Water Quality Management</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor recorded drinking-water quality test results and identify villages requiring attention.</p>
        </div>
        <Button onClick={handleOpenAddModal} className="flex items-center gap-2 whitespace-nowrap">
          <Plus size={18} /> Add Test Record
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-gray-50 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">{totalTests}</h3>
          <p className="text-xs font-medium text-gray-500 uppercase mt-1">Total Tests</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-indigo-50 border-indigo-200">
          <h3 className="text-2xl font-bold text-indigo-900">{villagesTested}</h3>
          <p className="text-xs font-medium text-indigo-700 uppercase mt-1">Villages Tested</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-green-50 border-green-200">
          <div className="flex items-center justify-center mb-1 text-green-600"><CheckCircle size={20} /></div>
          <h3 className="text-2xl font-bold text-green-900">{safeTests}</h3>
          <p className="text-xs font-medium text-green-700 uppercase mt-1">Safe</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-amber-50 border-amber-200">
          <div className="flex items-center justify-center mb-1 text-amber-600"><AlertTriangle size={20} /></div>
          <h3 className="text-2xl font-bold text-amber-900">{needsAttentionTests}</h3>
          <p className="text-xs font-medium text-amber-700 uppercase mt-1">Needs Attention</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-red-50 border-red-200">
          <div className="flex items-center justify-center mb-1 text-red-600"><XCircle size={20} /></div>
          <h3 className="text-2xl font-bold text-red-900">{criticalTests}</h3>
          <p className="text-xs font-medium text-red-700 uppercase mt-1">Critical</p>
        </Card>
      </div>

      {/* Status Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quality Overview</h3>
          <div className="h-48 flex items-center justify-center">
             <PieChart 
                data={statusData}
                colors={['#10b981', '#f59e0b', '#ef4444']}
             />
          </div>
        </Card>
        <Card className="p-4 lg:col-span-2 flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">About Quality Testing</h3>
          <p className="text-gray-600 text-sm mb-4">
            This dashboard visualizes manually recorded water-quality tests. The JalTrack system itself does not perform remote laboratory analysis. All data displayed here is submitted by authorized field operators or testing facilities.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Safe</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Needs Attention</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Critical</div>
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
              ...villages.map(v => ({ label: v.name, value: v.name }))
            ]}
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
          />

          <Select
            options={[
              { label: 'All Statuses', value: '' },
              ...waterQualityStatusList.map(s => ({ label: s, value: s }))
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />

          <Input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />

          <Select
            options={[
              { label: operatorLoading ? 'Loading Testers...' : operators.length === 0 ? 'No active operators available' : 'All Testers', value: '' },
              ...operators.map(o => ({ label: o.name, value: o.name }))
            ]}
            value={testerFilter}
            onChange={(e) => setTesterFilter(e.target.value)}
            disabled={operatorLoading || operators.length === 0}
          />
        </div>
        
        {/* Clear Filters Button */}
        {(searchTerm || villageFilter || dateFilter || statusFilter || testerFilter) && (
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
        title={selectedRecord ? 'Edit Test Record' : 'Add Test Record'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <Input 
              label="Test Date" 
              type="date"
              required 
              value={formData.testDate}
              onChange={(e) => setFormData({...formData, testDate: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Tested By" 
              required
              options={[
                { label: operatorLoading ? 'Loading Testers...' : operators.length === 0 ? 'No active operators available' : 'Select Tester...', value: '' },
                ...operators.map(o => ({ label: o.name, value: o.name }))
              ]}
              value={formData.testedBy}
              onChange={(e) => setFormData({...formData, testedBy: e.target.value})}
              disabled={operatorLoading || operators.length === 0}
            />
            <Select 
              label="Overall Status" 
              required
              options={waterQualityStatusList.map(s => ({ label: s, value: s }))}
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="pH Level" 
              type="number"
              step="0.1"
              required 
              value={formData.ph}
              onChange={(e) => setFormData({...formData, ph: e.target.value})}
            />
            <Input 
              label="Turbidity (NTU)" 
              type="number"
              step="0.1"
              required 
              value={formData.turbidity}
              onChange={(e) => setFormData({...formData, turbidity: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="TDS (mg/L)" 
              type="number"
              required 
              value={formData.tds}
              onChange={(e) => setFormData({...formData, tds: e.target.value})}
            />
            <Input 
              label="Chlorine (mg/L)" 
              type="number"
              step="0.1"
              required 
              value={formData.chlorine}
              onChange={(e) => setFormData({...formData, chlorine: e.target.value})}
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
        title="Water Quality Details"
        className="max-w-2xl"
      >
        {selectedRecord && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Test: {selectedRecord.id}</h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  Village: <span className="font-medium text-gray-800">{selectedRecord.village}</span> | Date: {selectedRecord.testDate}
                </p>
              </div>
              <Badge variant={getStatusBadgeVariant(selectedRecord.status)}>
                {selectedRecord.status}
              </Badge>
            </div>

            <div className={`p-4 rounded-lg border flex items-start gap-3 ${selectedRecord.status === 'Safe' ? 'bg-green-50 border-green-200' : selectedRecord.status === 'Needs Attention' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
              <Droplet className={`mt-1 ${selectedRecord.status === 'Safe' ? 'text-green-600' : selectedRecord.status === 'Needs Attention' ? 'text-amber-600' : 'text-red-600'}`} />
              <div>
                <h4 className={`font-semibold ${selectedRecord.status === 'Safe' ? 'text-green-800' : selectedRecord.status === 'Needs Attention' ? 'text-amber-800' : 'text-red-800'}`}>
                  Interpretation: {selectedRecord.status}
                </h4>
                <p className={`text-sm mt-1 ${selectedRecord.status === 'Safe' ? 'text-green-700' : selectedRecord.status === 'Needs Attention' ? 'text-amber-700' : 'text-red-700'}`}>
                  {selectedRecord.status === 'Safe' ? 'The water meets all standard quality guidelines and is safe for consumption.' : selectedRecord.status === 'Needs Attention' ? 'Certain parameters are outside optimal levels. Monitoring is advised.' : 'Water quality is severely compromised. Immediate action and chlorination is required.'}
                </p>
              </div>
            </div>

            {/* Test Parameters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 border border-gray-100 rounded bg-gray-50 text-center">
                <span className="text-xs text-gray-500 block mb-1">pH Level</span>
                <span className="text-lg font-bold text-gray-800">{selectedRecord.ph}</span>
              </div>
              <div className="p-3 border border-gray-100 rounded bg-gray-50 text-center">
                <span className="text-xs text-gray-500 block mb-1">Turbidity</span>
                <span className="text-lg font-bold text-gray-800">{selectedRecord.turbidity} <span className="text-xs font-normal text-gray-500">NTU</span></span>
              </div>
              <div className="p-3 border border-gray-100 rounded bg-gray-50 text-center">
                <span className="text-xs text-gray-500 block mb-1">TDS</span>
                <span className="text-lg font-bold text-gray-800">{selectedRecord.tds} <span className="text-xs font-normal text-gray-500">mg/L</span></span>
              </div>
              <div className="p-3 border border-gray-100 rounded bg-gray-50 text-center">
                <span className="text-xs text-gray-500 block mb-1">Chlorine</span>
                <span className="text-lg font-bold text-gray-800">{selectedRecord.chlorine} <span className="text-xs font-normal text-gray-500">mg/L</span></span>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Tested By</span>
                <span className="font-medium text-gov-blue">{selectedRecord.testedBy}</span>
              </div>
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Last Updated</span>
                <span className="font-medium text-gray-600">{new Date(selectedRecord.lastUpdated).toLocaleString()}</span>
              </div>
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

export default WaterQuality;
