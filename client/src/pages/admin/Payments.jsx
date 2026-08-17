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
import { Search, Edit2, AlertCircle, Eye, RefreshCw, IndianRupee, CreditCard, Calendar, FileText, CheckCircle, Clock, Plus, AlertTriangle, MapPin, User } from 'lucide-react';
import { mockPayments, paymentMethods, billingPeriods, paymentStatuses } from '../../data/mockPayments';
import api from '../../services/api';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [villages, setVillages] = useState([]);
  const [villagers, setVillagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');

  // Modals state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formError, setFormError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    householdId: '',
    householdName: '',
    village: '',
    billingPeriod: billingPeriods[1],
    amountDue: 150,
    amountPaid: 0,
    paymentDate: '',
    paymentMethod: '',
    status: 'Pending',
    remarks: ''
  });

  // Calculate balance dynamically
  const formBalance = Math.max(0, formData.amountDue - formData.amountPaid);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const [paymentsRes, villagesRes, usersRes] = await Promise.all([
        api.get('/payments?limit=100'),
        api.get('/villages?limit=100'),
        api.get('/users?role=villager&limit=100')
      ]);
      setVillages(villagesRes.data);
      setVillagers(usersRes.data);

      const mapped = paymentsRes.data.map(p => ({
        id: p._id.toString(),
        householdId: p.user?.userId || p.user?._id || 'Unknown',
        householdName: p.user?.name || 'Unknown User',
        village: p.village?.name || 'Unknown Village',
        villageId: p.village?._id || '',
        billingPeriod: 'August 2026',
        amountDue: p.amount,
        amountPaid: p.status === 'Paid' ? p.amount : 0,
        paymentDate: p.paidDate || '',
        paymentMethod: p.paymentMethod || '',
        status: p.status,
        remarks: p.transactionId || '',
        recordedBy: 'Admin User'
      }));
      setPayments(mapped);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Filtered Records
  const filteredPayments = payments.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      p.householdName.toLowerCase().includes(searchLower) || 
      p.householdId.toLowerCase().includes(searchLower) ||
      p.id.toLowerCase().includes(searchLower) ||
      p.village.toLowerCase().includes(searchLower);
    
    const matchesVillage = villageFilter ? p.village === villageFilter : true;
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    const matchesMethod = methodFilter ? p.paymentMethod === methodFilter : true;
    const matchesPeriod = periodFilter ? p.billingPeriod === periodFilter : true;

    return matchesSearch && matchesVillage && matchesStatus && matchesMethod && matchesPeriod;
  });

  // Summary Calculations
  const totalHouseholds = new Set(payments.map(p => p.householdId)).size;
  const totalAmountDue = payments.reduce((sum, p) => sum + p.amountDue, 0);
  const totalAmountCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const outstandingAmount = totalAmountDue - totalAmountCollected;
  const paidHouseholds = payments.filter(p => p.status === 'Paid').length;
  const pendingPayments = payments.filter(p => p.status === 'Pending' || p.status === 'Overdue').length;
  
  const collectionRate = totalAmountDue > 0 ? ((totalAmountCollected / totalAmountDue) * 100).toFixed(1) : 0;

  // Analytics Data
  const statusData = paymentStatuses.map(status => ({
    name: status,
    value: payments.filter(p => p.status === status).length
  })).filter(d => d.value > 0);

  const villageCollectionData = villages.map(village => {
    const villagePayments = payments.filter(p => p.village === village.name);
    if (villagePayments.length === 0) return null;
    return {
      name: village.name,
      value: villagePayments.reduce((sum, p) => sum + p.amountPaid, 0)
    };
  }).filter(Boolean);

  // Handlers
  const handleClearFilters = () => {
    setSearchTerm('');
    setVillageFilter('');
    setStatusFilter('');
    setMethodFilter('');
    setPeriodFilter('');
  };

  const handleOpenViewModal = (payment) => {
    setSelectedPayment(payment);
    setIsViewModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setSelectedPayment(null);
    setFormData({
      householdId: '', householdName: '', village: '',
      billingPeriod: billingPeriods[1], amountDue: 150, amountPaid: 0,
      paymentDate: new Date().toISOString().split('T')[0], paymentMethod: '',
      status: 'Pending', remarks: ''
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (payment) => {
    setSelectedPayment(payment);
    setFormData({ 
      ...payment,
      paymentDate: payment.paymentDate || '',
      paymentMethod: payment.paymentMethod || ''
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const vDoc = villages.find(v => v.name === formData.village);
      if (!vDoc) throw new Error('Selected village name is invalid.');

      const userDoc = villagers.find(u => u.name === formData.householdName || u.userId === formData.householdId);
      if (!userDoc) throw new Error('Selected household (villager) is invalid.');

      const payload = {
        user: userDoc._id,
        village: vDoc._id,
        amount: Number(formData.amountDue),
        dueDate: formData.paymentDate || new Date().toISOString().split('T')[0],
        paidDate: formData.status === 'Paid' ? (formData.paymentDate || new Date().toISOString().split('T')[0]) : '',
        status: formData.status,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.remarks || ''
      };

      if (selectedPayment) {
        await api.put(`/payments/${selectedPayment.id}`, payload);
      } else {
        await api.post('/payments', payload);
      }

      setIsFormModalOpen(false);
      fetchRecords();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save payment.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'default';
      case 'Partially Paid': return 'warning';
      case 'Overdue': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    { header: 'Pay ID', accessor: 'id' },
    { header: 'Household', accessor: 'householdName' },
    { header: 'Village', accessor: 'village' },
    { header: 'Billing Period', accessor: 'billingPeriod' },
    { 
      header: 'Amount Due', 
      accessor: 'amountDue',
      render: (row) => formatCurrency(row.amountDue)
    },
    { 
      header: 'Amount Paid', 
      accessor: 'amountPaid',
      render: (row) => formatCurrency(row.amountPaid)
    },
    { 
      header: 'Balance', 
      render: (row) => (
        <span className={row.amountDue - row.amountPaid > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
          {formatCurrency(row.amountDue - row.amountPaid)}
        </span>
      )
    },
    { header: 'Date', accessor: 'paymentDate', render: (row) => row.paymentDate || '-' },
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
          <button onClick={() => handleOpenEditModal(row)} className="text-gray-500 hover:text-gov-blue" title="Edit Record">
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
        <span className="ml-2 text-gray-600">Loading fee records...</span>
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
          <h2 className="text-2xl font-bold text-gray-800">Fee Collection</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor household water-service fees, payment status and outstanding collections across registered villages.</p>
        </div>
        <Button onClick={handleOpenAddModal} className="flex items-center gap-2 whitespace-nowrap">
          <Plus size={18} /> Add Payment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-gray-50 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">{totalHouseholds}</h3>
          <p className="text-[10px] font-medium text-gray-500 uppercase mt-1">Total HH</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-blue-50 border-blue-200 col-span-2 xl:col-span-1">
          <h3 className="text-xl font-bold text-blue-900">{formatCurrency(totalAmountDue)}</h3>
          <p className="text-[10px] font-medium text-blue-700 uppercase mt-1">Total Due</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-green-50 border-green-200 col-span-2 xl:col-span-1">
          <h3 className="text-xl font-bold text-green-900">{formatCurrency(totalAmountCollected)}</h3>
          <p className="text-[10px] font-medium text-green-700 uppercase mt-1">Collected</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-red-50 border-red-200 col-span-2 xl:col-span-1">
          <h3 className="text-xl font-bold text-red-900">{formatCurrency(outstandingAmount)}</h3>
          <p className="text-[10px] font-medium text-red-700 uppercase mt-1">Outstanding</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-indigo-50 border-indigo-200">
          <h3 className="text-xl font-bold text-indigo-900">{paidHouseholds}</h3>
          <p className="text-[10px] font-medium text-indigo-700 uppercase mt-1">Paid HH</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-amber-50 border-amber-200">
          <h3 className="text-xl font-bold text-amber-900">{pendingPayments}</h3>
          <p className="text-[10px] font-medium text-amber-700 uppercase mt-1">Pending/Overdue</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center bg-gray-100 border-gray-300">
          <h3 className="text-xl font-bold text-gray-700">{collectionRate}%</h3>
          <p className="text-[10px] font-medium text-gray-600 uppercase mt-1">Collection Rate</p>
        </Card>
      </div>

      {/* Analytics Charts & Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Status</h3>
          <div className="h-48 flex items-center justify-center">
             <PieChart 
                data={statusData}
                colors={['#10b981', '#9ca3af', '#f59e0b', '#ef4444']}
             />
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Collection by Village</h3>
          <div className="h-48 flex items-center justify-center">
             <BarChart 
                data={villageCollectionData}
                xKey="name"
                yKey="value"
                colors={['#10b981', '#3b82f6', '#f59e0b']}
             />
          </div>
        </Card>
        <Card className="p-4 bg-red-50/50 border-red-100 flex flex-col">
          <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} /> Needs Attention
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {payments.filter(p => p.status === 'Overdue' || (p.amountDue - p.amountPaid > 200)).length === 0 ? (
              <p className="text-gray-500 text-sm italic">No severe outstanding balances.</p>
            ) : (
              payments.filter(p => p.status === 'Overdue' || (p.amountDue - p.amountPaid > 200)).map(p => (
                <div key={p.id} className="bg-white p-3 border border-red-200 rounded shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{p.householdName}</span>
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase">{p.status}</span>
                  </div>
                  <p className="text-xs text-gray-600 flex items-center gap-1 mb-1"><MapPin size={10} /> {p.village} ({p.householdId})</p>
                  <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                    Balance: {formatCurrency(p.amountDue - p.amountPaid)}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="relative lg:col-span-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <Input 
              placeholder="Search HH or ID..." 
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
            options={[{ label: 'All Statuses', value: '' }, ...paymentStatuses.map(s => ({ label: s, value: s }))]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />

          <Select
            options={[{ label: 'All Methods', value: '' }, ...paymentMethods.map(m => ({ label: m, value: m }))]}
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          />

          <Select
            options={[{ label: 'All Periods', value: '' }, ...billingPeriods.map(bp => ({ label: bp, value: bp }))]}
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
          />
        </div>
        
        {/* Clear Filters Button */}
        {(searchTerm || villageFilter || statusFilter || methodFilter || periodFilter) && (
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
        <Table columns={columns} data={filteredPayments} keyExtractor={row => row.id} />
      </Card>

      {/* Form Modal (Add/Edit) */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title={selectedPayment ? 'Edit Payment Record' : 'Add Payment Record'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="bg-red-50 text-red-700 p-2 rounded text-sm flex gap-2 items-center">
              <AlertCircle size={16} /> {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Household ID" 
              required 
              value={formData.householdId}
              onChange={(e) => setFormData({...formData, householdId: e.target.value})}
              disabled={!!selectedPayment}
            />
            <Input 
              label="Household Name" 
              required 
              value={formData.householdName}
              onChange={(e) => setFormData({...formData, householdName: e.target.value})}
              disabled={!!selectedPayment}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Village" 
              required
              options={[{ label: 'Select Village...', value: '' }, ...villages.map(v => ({ label: v.name, value: v.name }))]}
              value={formData.village}
              onChange={(e) => setFormData({...formData, village: e.target.value})}
              disabled={!!selectedPayment}
            />
            <Select 
              label="Billing Period" 
              required
              options={billingPeriods.map(bp => ({ label: bp, value: bp }))}
              value={formData.billingPeriod}
              onChange={(e) => setFormData({...formData, billingPeriod: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-3 bg-gray-50/50 rounded px-2">
            <Input 
              label="Amount Due (₹)" 
              type="number"
              required 
              value={formData.amountDue}
              onChange={(e) => setFormData({...formData, amountDue: e.target.value})}
            />
            <Input 
              label="Amount Paid (₹)" 
              type="number"
              required 
              value={formData.amountPaid}
              onChange={(e) => setFormData({...formData, amountPaid: e.target.value})}
            />
            <div className="flex flex-col justify-end pb-2">
              <span className="text-xs text-gray-500 block mb-1">Calculated Balance</span>
              <span className={`text-lg font-bold ${formBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(formBalance)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input 
              label="Payment Date" 
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
            />
            <Select 
              label="Method" 
              options={[{ label: 'None', value: '' }, ...paymentMethods.map(m => ({ label: m, value: m }))]}
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
            />
            <Select 
              label="Status" 
              required
              options={paymentStatuses.map(s => ({ label: s, value: s }))}
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            />
          </div>

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

      {/* View Details Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        title="Payment Details"
        className="max-w-2xl"
      >
        {selectedPayment && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedPayment.householdName}</h3>
                <p className="text-sm text-gray-500 mt-1">HH ID: {selectedPayment.householdId} | Village: {selectedPayment.village}</p>
                <p className="text-sm text-gray-500">Record ID: {selectedPayment.id}</p>
              </div>
              <Badge variant={getStatusBadgeVariant(selectedPayment.status)}>
                {selectedPayment.status}
              </Badge>
            </div>

            {/* Payment Summary Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
              <h4 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <FileText size={16} /> Payment Summary - {selectedPayment.billingPeriod}
              </h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-800">Amount Due</span>
                <span className="font-semibold text-gray-900">{formatCurrency(selectedPayment.amountDue)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-blue-800">Amount Paid</span>
                <span className="font-semibold text-green-700">{formatCurrency(selectedPayment.amountPaid)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                <span className="font-bold text-blue-900">Outstanding Balance</span>
                <span className={`text-xl font-bold ${selectedPayment.amountDue - selectedPayment.amountPaid > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(selectedPayment.amountDue - selectedPayment.amountPaid)}
                </span>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm border-t border-gray-100 pt-4">
              <div className="flex flex-col border-b border-dashed pb-1">
                <span className="text-gray-500 flex items-center gap-1 mb-1"><Calendar size={14} /> Payment Date</span>
                <span className="font-medium text-gray-900">{selectedPayment.paymentDate || <span className="italic text-gray-400">Not paid</span>}</span>
              </div>
              <div className="flex flex-col border-b border-dashed pb-1">
                <span className="text-gray-500 flex items-center gap-1 mb-1"><CreditCard size={14} /> Payment Method</span>
                <span className="font-medium text-gray-900">{selectedPayment.paymentMethod || '-'}</span>
              </div>
              <div className="flex flex-col border-b border-dashed pb-1">
                <span className="text-gray-500 flex items-center gap-1 mb-1"><User size={14} /> Recorded By</span>
                <span className="font-medium text-gray-900">{selectedPayment.recordedBy}</span>
              </div>
              <div className="flex flex-col border-b border-dashed pb-1">
                <span className="text-gray-500 flex items-center gap-1 mb-1"><Clock size={14} /> Last Updated</span>
                <span className="font-medium text-gray-900">{new Date(selectedPayment.lastUpdated).toLocaleString()}</span>
              </div>
            </div>

            {selectedPayment.remarks && (
              <div className="pt-2">
                <p className="text-sm text-gray-500 block mb-1">Remarks</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200">{selectedPayment.remarks}</p>
              </div>
            )}
            
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
              <Button onClick={() => { setIsViewModalOpen(false); handleOpenEditModal(selectedPayment); }}>Edit / Update Status</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payments;
