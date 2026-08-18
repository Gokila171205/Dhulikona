import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';
import { 
  Activity, Users, Home, Droplet, AlertTriangle, CheckCircle, 
  CreditCard, BarChart2, RefreshCw, Settings, FileText, AlertCircle, XCircle 
} from 'lucide-react';
import { mockAnalytics, districtsList, dateRangeOptions } from '../../data/mockAnalytics';
import { villagesList } from '../../data/mockUsers';
import { operatorsList } from '../../data/mockVillages';
import api from '../../services/api';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Global Filters
  const [dateRange, setDateRange] = useState(dateRangeOptions[1]); // Default to Last 30 Days
  const [villageFilter, setVillageFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');

  // Fetch records
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/dashboard');
        setData(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [dateRange, villageFilter, districtFilter, operatorFilter]);

  const handleClearFilters = () => {
    setDateRange(dateRangeOptions[1]);
    setVillageFilter('');
    setDistrictFilter('');
    setOperatorFilter('');
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Good': return 'success';
      case 'Needs Attention': return 'warning';
      case 'Critical': return 'danger';
      default: return 'default';
    }
  };

  const villageColumns = [
    { header: 'Village', accessor: 'village' },
    { header: 'HH', accessor: 'households' },
    { header: 'Pumps (Work/Tot)', render: (row) => `${row.workingPumps}/${row.pumps}` },
    { 
      header: 'Supply %', 
      accessor: 'supplyReliability',
      render: (row) => (
        <span className={row.supplyReliability >= 90 ? 'text-green-600 font-medium' : row.supplyReliability >= 80 ? 'text-amber-600 font-medium' : 'text-red-600 font-medium'}>
          {row.supplyReliability}%
        </span>
      )
    },
    { 
      header: 'Water Quality', 
      accessor: 'waterQualityStatus',
      render: (row) => (
        <span className={`text-xs font-semibold ${row.waterQualityStatus === 'Good' ? 'text-green-600' : row.waterQualityStatus === 'Needs Attention' ? 'text-amber-600' : 'text-red-600'}`}>
          {row.waterQualityStatus}
        </span>
      )
    },
    { header: 'Open Compl.', accessor: 'openComplaints' },
    { header: 'Maint. Pend.', accessor: 'maintenancePending' },
    { 
      header: 'Collect %', 
      accessor: 'collectionRate',
      render: (row) => (
        <span className={row.collectionRate >= 80 ? 'text-green-600 font-medium' : row.collectionRate >= 50 ? 'text-amber-600 font-medium' : 'text-red-600 font-medium'}>
          {row.collectionRate}%
        </span>
      )
    },
    { 
      header: 'Overall', 
      accessor: 'overallStatus',
      render: (row) => (
        <Badge variant={getStatusBadgeVariant(row.overallStatus)}>
          {row.overallStatus}
        </Badge>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
        <span className="ml-2 text-gray-600">Compiling system analytics...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
        <AlertCircle size={20} />
        <span>{error || 'Data could not be loaded.'}</span>
      </div>
    );
  }

  const overview = data?.overview || {};
  const waterSupply = data?.waterSupply || {};
  const complaints = data?.complaints || {};
  const pumps = data?.pumps || {};
  const waterQuality = data?.waterQuality || {};
  const maintenance = data?.maintenance || {};
  const payments = data?.payments || {};
  const villagesPerformance = data?.villagesPerformance || [];

  const pumpsAvailable = pumps.available !== false;
  const complaintsAvailable = complaints.available !== false;
  const waterSupplyAvailable = waterSupply.available !== false;
  const waterQualityAvailable = waterQuality.available !== false;
  const maintenanceAvailable = maintenance.available !== false;
  const paymentsAvailable = payments.available !== false;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">System Analytics</h2>
          <p className="text-gray-500 text-sm mt-1">Analyze water-service performance, complaints, pump operations, water quality, maintenance and fee collection across registered villages.</p>
        </div>
      </div>

      {/* Global Filters */}
      <Card className="p-4 bg-gray-50/50">
        <div className="flex items-center gap-2 mb-3">
          <Settings size={16} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Global Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <Select
            label="Date Range"
            options={dateRangeOptions.map(r => ({ label: r, value: r }))}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          />
          <Select
            label="District"
            options={[{ label: 'All Districts', value: '' }, ...districtsList.map(d => ({ label: d, value: d }))]}
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          />
          <Select
            label="Village"
            options={[{ label: 'All Villages', value: '' }, ...villagesList.map(v => ({ label: v, value: v }))]}
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
          />
          <Select
            label="Operator"
            options={[{ label: 'All Operators', value: '' }, ...operatorsList.map(o => ({ label: o.name, value: o.name }))]}
            value={operatorFilter}
            onChange={(e) => setOperatorFilter(e.target.value)}
          />
        </div>
        
        {(dateRange !== dateRangeOptions[1] || villageFilter || districtFilter || operatorFilter) && (
          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleClearFilters}
              className="text-sm text-gov-blue hover:underline flex items-center gap-1 font-medium"
            >
              <RefreshCw size={14} /> Clear filters
            </button>
          </div>
        )}
      </Card>

      {/* Key Performance Indicators */}
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pt-2 border-b pb-2">
        <BarChart2 size={20} className="text-gov-blue" /> Key Performance Indicators
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="p-4 bg-white border-gray-200">
          <p className="text-[11px] font-medium text-gray-500 uppercase flex items-center gap-1"><Home size={12}/> Villages & HH</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{overview.totalVillages || 0} <span className="text-sm font-normal text-gray-500">Vil</span></h3>
          <h3 className="text-xl font-semibold text-gray-700">{overview.totalHouseholds || 0} <span className="text-sm font-normal text-gray-500">HH</span></h3>
        </Card>
        
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-[11px] font-medium text-blue-700 uppercase flex items-center gap-1"><Settings size={12}/> Pump Operations</p>
          {pumpsAvailable ? (
            <>
              <div className="flex items-end gap-2 mt-2">
                <h3 className="text-2xl font-bold text-blue-900">{overview.workingPumps || 0}</h3>
                <span className="text-sm text-blue-800 mb-1">/ {overview.totalPumps || 0} Working</span>
              </div>
              <p className="text-sm font-medium text-blue-800 mt-1">{overview.waterSupplyReliability || 0}% Supply Reliability</p>
            </>
          ) : (
            <p className="text-sm font-medium text-blue-800 mt-2">Data not available</p>
          )}
        </Card>
        
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-[11px] font-medium text-green-700 uppercase flex items-center gap-1"><Droplet size={12}/> Water Quality</p>
          {waterQualityAvailable ? (
            <>
              <h3 className="text-2xl font-bold text-green-900 mt-2">{overview.waterQualitySafeRate || 0}%</h3>
              <p className="text-sm font-medium text-green-800 mt-1">Safe Rate</p>
            </>
          ) : (
            <p className="text-sm font-medium text-green-800 mt-2">Data not available</p>
          )}
        </Card>

        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-[11px] font-medium text-amber-700 uppercase flex items-center gap-1"><AlertTriangle size={12}/> Resolution Rates</p>
          {complaintsAvailable ? (
            <>
              <h3 className="text-2xl font-bold text-amber-900 mt-2">{overview.complaintResolutionRate || 0}%</h3>
              <p className="text-sm font-medium text-amber-800 mt-1">Complaints Solved</p>
            </>
          ) : (
            <p className="text-sm font-medium text-amber-800 mt-2">Data not available</p>
          )}
        </Card>

        <Card className="p-4 bg-indigo-50 border-indigo-200">
          <p className="text-[11px] font-medium text-indigo-700 uppercase flex items-center gap-1"><CreditCard size={12}/> Financial</p>
          {paymentsAvailable ? (
            <>
              <h3 className="text-2xl font-bold text-indigo-900 mt-2">{overview.feeCollectionRate || 0}%</h3>
              <p className="text-sm font-medium text-indigo-800 mt-1">Fee Collection Rate</p>
            </>
          ) : (
            <p className="text-sm font-medium text-indigo-800 mt-2">Data not available</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Water Supply Analytics */}
        <Card className="p-5 flex flex-col min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 flex justify-between items-center">
            Water Supply Performance
            {waterSupplyAvailable && <Badge variant="primary">{overview.waterSupplyReliability || 0}% Reliable</Badge>}
          </h3>
          {waterSupplyAvailable ? (
            <>
              <div className="grid grid-cols-3 gap-2 py-4">
                <div className="text-center"><p className="text-xl font-bold text-gray-800">{waterSupply.scheduledSupplies || 0}</p><p className="text-xs text-gray-500 uppercase">Scheduled</p></div>
                <div className="text-center"><p className="text-xl font-bold text-green-600">{waterSupply.completedSupplies || 0}</p><p className="text-xs text-gray-500 uppercase">Completed</p></div>
                <div className="text-center"><p className="text-xl font-bold text-red-600">{waterSupply.missedSupplies || 0}</p><p className="text-xs text-gray-500 uppercase">Missed</p></div>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-2">Supply Reliability Over Time (%)</p>
              <div className="h-48 mt-auto border border-gray-100 rounded bg-gray-50 flex items-center justify-center p-2">
                <BarChart data={waterSupply.trend || []} xKey="name" yKey="value" colors={['#3b82f6']} />
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 italic py-6 text-center my-auto">Data not available</p>
          )}
        </Card>

        {/* Complaint Analytics */}
        <Card className="p-5 flex flex-col min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 flex justify-between items-center">
            Complaint Performance
            {complaintsAvailable && <Badge variant="warning">{complaints.total || 0} Total Complaints</Badge>}
          </h3>
          {complaintsAvailable ? (
            <>
              <div className="grid grid-cols-3 gap-2 py-4">
                <div className="text-center"><p className="text-xl font-bold text-amber-600">{(complaints.new || 0) + (complaints.inProgress || 0)}</p><p className="text-xs text-gray-500 uppercase">Open</p></div>
                <div className="text-center"><p className="text-xl font-bold text-green-600">{(complaints.resolved || 0) + (complaints.closed || 0)}</p><p className="text-xs text-gray-500 uppercase">Resolved</p></div>
                <div className="text-center"><p className="text-xl font-bold text-red-600">{complaints.overdue || 0}</p><p className="text-xs text-gray-500 uppercase">Overdue</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2 text-center">Complaints by Status</p>
                  <div className="h-48 border border-gray-100 rounded bg-gray-50 flex items-center justify-center p-2">
                    <PieChart data={complaints.byStatus || []} colors={['#3b82f6', '#f59e0b', '#10b981', '#9ca3af', '#ef4444']} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2 text-center">Complaint Trend</p>
                  <div className="h-48 border border-gray-100 rounded bg-gray-50 flex items-center justify-center p-2">
                    <BarChart data={complaints.trend || []} xKey="name" yKey="value" colors={['#f59e0b']} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 italic py-6 text-center my-auto">Data not available</p>
          )}
        </Card>

        {/* Pump Analytics */}
        <Card className="p-5 flex flex-col min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 flex justify-between items-center">
            Pump Performance
            {pumpsAvailable && <Badge variant="success">{pumps.total > 0 ? ((pumps.working / pumps.total) * 100).toFixed(1) : 100}% Available</Badge>}
          </h3>
          {pumpsAvailable ? (
            <>
              <div className="grid grid-cols-4 gap-2 py-4">
                <div className="text-center"><p className="text-xl font-bold text-gray-800">{pumps.total || 0}</p><p className="text-[10px] text-gray-500 uppercase">Total</p></div>
                <div className="text-center"><p className="text-xl font-bold text-green-600">{pumps.working || 0}</p><p className="text-[10px] text-gray-500 uppercase">Working</p></div>
                <div className="text-center"><p className="text-xl font-bold text-amber-600">{pumps.underMaintenance || 0}</p><p className="text-[10px] text-gray-500 uppercase">In Maint.</p></div>
                <div className="text-center"><p className="text-xl font-bold text-red-600">{pumps.notWorking || 0}</p><p className="text-[10px] text-gray-500 uppercase">Not Work.</p></div>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-2">Pump Status Distribution</p>
              <div className="h-48 mt-auto border border-gray-100 rounded bg-gray-50 flex items-center justify-center p-2">
                <PieChart data={pumps.statusDistribution || []} colors={['#10b981', '#f59e0b', '#ef4444']} />
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 italic py-6 text-center my-auto">Data not available</p>
          )}
        </Card>

        {/* Water Quality & Maintenance Combined */}
        <div className="space-y-6 flex flex-col">
          <Card className="p-5 flex-1">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex justify-between items-center">
              Water Quality Overview
            </h3>
            {waterQualityAvailable ? (
              <div className="flex gap-4 items-center mt-3">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1"><span className="text-sm text-gray-600">Safe</span><span className="font-bold text-green-600">{waterQuality.safe || 0}</span></div>
                  <div className="flex justify-between items-center mb-1"><span className="text-sm text-gray-600">Needs Attention</span><span className="font-bold text-amber-600">{waterQuality.needsAttention || 0}</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Critical</span><span className="font-bold text-red-600">{waterQuality.critical || 0}</span></div>
                </div>
                <div className="h-28 w-28 shrink-0">
                  <PieChart data={waterQuality.statusDistribution || []} colors={['#10b981', '#f59e0b', '#ef4444']} hideLegend />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic py-6 text-center">Data not available</p>
            )}
          </Card>
          
          <Card className="p-5 flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex justify-between items-center">
              Maintenance Performance
            </h3>
            {maintenanceAvailable ? (
              <div className="flex gap-4 items-center mt-3">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1"><span className="text-sm text-gray-600">Pending/In Prog.</span><span className="font-bold text-amber-600">{(maintenance.pending || 0) + (maintenance.inProgress || 0)}</span></div>
                  <div className="flex justify-between items-center mb-1"><span className="text-sm text-gray-600">Completed</span><span className="font-bold text-green-600">{maintenance.completed || 0}</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Overdue/Emerg.</span><span className="font-bold text-red-600">{(maintenance.overdue || 0) + (maintenance.emergency || 0)}</span></div>
                </div>
                <div className="h-28 w-28 shrink-0">
                  <PieChart data={[
                    {name: 'Open', value: (maintenance.pending || 0) + (maintenance.inProgress || 0)},
                    {name: 'Done', value: maintenance.completed || 0},
                    {name: 'Critical', value: (maintenance.overdue || 0) + (maintenance.emergency || 0)}
                  ]} colors={['#f59e0b', '#10b981', '#ef4444']} hideLegend />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic py-6 text-center">Data not available</p>
            )}
          </Card>
        </div>

        {/* Fee Collection Analytics */}
        <Card className="p-5 xl:col-span-2 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 flex justify-between items-center">
            Fee Collection Performance
            {paymentsAvailable && <Badge variant={overview.feeCollectionRate > 70 ? "success" : "warning"}>{overview.feeCollectionRate || 0}% Collected</Badge>}
          </h3>
          {paymentsAvailable ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                <div className="bg-gray-50 p-3 rounded border text-center">
                  <p className="text-xs text-gray-500 uppercase mb-1">Total Amount Due</p>
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(payments.amountDue || 0)}</p>
                </div>
                <div className="bg-green-50 border-green-100 p-3 rounded border text-center">
                  <p className="text-xs text-green-700 uppercase mb-1">Total Collected</p>
                  <p className="text-xl font-bold text-green-800">{formatCurrency(payments.amountCollected || 0)}</p>
                </div>
                <div className="bg-red-50 border-red-100 p-3 rounded border text-center">
                  <p className="text-xs text-red-700 uppercase mb-1">Total Outstanding</p>
                  <p className="text-xl font-bold text-red-800">{formatCurrency(payments.outstanding || 0)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2 text-center">Monthly Collection Trend</p>
                  <div className="h-56 border border-gray-100 rounded bg-gray-50 flex items-center justify-center p-2">
                    <BarChart data={payments.trend || []} xKey="name" yKey="value" colors={['#10b981']} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2 text-center">Collection by Village</p>
                  <div className="h-56 border border-gray-100 rounded bg-gray-50 flex items-center justify-center p-2">
                    <BarChart data={payments.byVillage || []} xKey="name" yKey="value" colors={['#3b82f6']} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 italic py-6 text-center">Data not available</p>
          )}
        </Card>
      </div>

      {/* Highlights: Top & Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-0 overflow-hidden border-green-200">
          <div className="bg-green-50 p-3 border-b border-green-100 flex items-center gap-2">
            <CheckCircle className="text-green-600" size={18} />
            <h3 className="font-semibold text-green-800">Top Performing Villages</h3>
          </div>
          <div className="p-4 space-y-3">
            {villagesPerformance.filter(v => v.overallStatus === 'Good').map(v => (
              <div key={v.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <h4 className="font-bold text-gray-900">{v.village}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Reliability: {v.supplyReliability}% | Coll.: {v.collectionRate}%</p>
                </div>
                <Badge variant="success">Excellent</Badge>
              </div>
            ))}
            {villagesPerformance.filter(v => v.overallStatus === 'Good').length === 0 && (
              <p className="text-sm text-gray-500 italic p-2 text-center">No villages currently meet top performance criteria.</p>
            )}
          </div>
        </Card>
        
        <Card className="p-0 overflow-hidden border-red-200">
          <div className="bg-red-50 p-3 border-b border-red-100 flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={18} />
            <h3 className="font-semibold text-red-800">Needs Attention</h3>
          </div>
          <div className="p-4 space-y-3">
            {villagesPerformance.filter(v => v.overallStatus === 'Critical' || v.overallStatus === 'Needs Attention').map(v => (
              <div key={v.id} className="flex justify-between items-center p-3 border border-red-100 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <h4 className="font-bold text-gray-900">{v.village}</h4>
                  <p className="text-xs text-red-600 mt-0.5">
                    {v.openComplaints > 4 ? `High Complaints (${v.openComplaints})` : ''} 
                    {v.openComplaints > 4 && v.waterQualityStatus !== 'Good' ? ' • ' : ''}
                    {v.waterQualityStatus !== 'Good' ? `Water Qlty: ${v.waterQualityStatus}` : ''}
                  </p>
                </div>
                <Badge variant={v.overallStatus === 'Critical' ? 'danger' : 'warning'}>{v.overallStatus}</Badge>
              </div>
            ))}
            {villagesPerformance.filter(v => v.overallStatus === 'Critical' || v.overallStatus === 'Needs Attention').length === 0 && (
              <p className="text-sm text-gray-500 italic p-2 text-center">No villages currently require attention.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Village Performance Table */}
      <Card className="flex flex-col">
        <div className="p-5 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Detailed Village Performance</h3>
          <p className="text-sm text-gray-500 mt-1">Comprehensive breakdown of all tracked metrics per village.</p>
        </div>
        <div className="overflow-x-auto">
          <Table columns={villageColumns} data={villagesPerformance} keyExtractor={row => row.id} />
        </div>
      </Card>
      
    </div>
  );
};

export default Analytics;
