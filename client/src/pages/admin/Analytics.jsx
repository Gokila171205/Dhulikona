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
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, filters would be sent to the API to recalculate these aggregations.
        // Here we just use the static mock data.
        setData(mockAnalytics);
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
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{data.overview.totalVillages} <span className="text-sm font-normal text-gray-500">Vil</span></h3>
          <h3 className="text-xl font-semibold text-gray-700">{data.overview.totalHouseholds} <span className="text-sm font-normal text-gray-500">HH</span></h3>
        </Card>
        
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-[11px] font-medium text-blue-700 uppercase flex items-center gap-1"><Settings size={12}/> Pump Operations</p>
          <div className="flex items-end gap-2 mt-2">
            <h3 className="text-2xl font-bold text-blue-900">{data.overview.workingPumps}</h3>
            <span className="text-sm text-blue-800 mb-1">/ {data.overview.totalPumps} Working</span>
          </div>
          <p className="text-sm font-medium text-blue-800 mt-1">{data.overview.waterSupplyReliability}% Supply Reliablity</p>
        </Card>
        
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-[11px] font-medium text-green-700 uppercase flex items-center gap-1"><Droplet size={12}/> Water Quality</p>
          <h3 className="text-2xl font-bold text-green-900 mt-2">{data.overview.waterQualitySafeRate}%</h3>
          <p className="text-sm font-medium text-green-800 mt-1">Safe Rate</p>
        </Card>

        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-[11px] font-medium text-amber-700 uppercase flex items-center gap-1"><AlertTriangle size={12}/> Resolution Rates</p>
          <h3 className="text-2xl font-bold text-amber-900 mt-2">{data.overview.complaintResolutionRate}%</h3>
          <p className="text-sm font-medium text-amber-800 mt-1">Complaints Solved</p>
        </Card>

        <Card className="p-4 bg-indigo-50 border-indigo-200">
          <p className="text-[11px] font-medium text-indigo-700 uppercase flex items-center gap-1"><CreditCard size={12}/> Financial</p>
          <h3 className="text-2xl font-bold text-indigo-900 mt-2">{data.overview.feeCollectionRate}%</h3>
          <p className="text-sm font-medium text-indigo-800 mt-1">Fee Collection Rate</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Water Supply Analytics */}
        <Card className="p-5 flex flex-col min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 flex justify-between items-center">
            Water Supply Performance
            <Badge variant="primary">{data.overview.waterSupplyReliability}% Reliable</Badge>
          </h3>
          <div className="grid grid-cols-3 gap-2 py-4">
            <div className="text-center"><p className="text-xl font-bold text-gray-800">{data.waterSupply.scheduledSupplies}</p><p className="text-xs text-gray-500 uppercase">Scheduled</p></div>
            <div className="text-center"><p className="text-xl font-bold text-green-600">{data.waterSupply.completedSupplies}</p><p className="text-xs text-gray-500 uppercase">Completed</p></div>
            <div className="text-center"><p className="text-xl font-bold text-red-600">{data.waterSupply.missedSupplies}</p><p className="text-xs text-gray-500 uppercase">Missed</p></div>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-2">Supply Reliability Over Time (%)</p>
          <div className="h-48 mt-auto border border-gray-100 rounded bg-gray-50 flex items-center justify-center p-2">
            <BarChart data={data.waterSupply.trend} xKey="name" yKey="value" colors={['#3b82f6']} />
          </div>
        </Card>

        {/* Complaint Analytics */}
        <Card className="p-5 flex flex-col min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 flex justify-between items-center">
            Complaint Performance
            <Badge variant="warning">{data.complaints.total} Total Complaints</Badge>
          </h3>
          <div className="grid grid-cols-3 gap-2 py-4">
            <div className="text-center"><p className="text-xl font-bold text-amber-600">{data.complaints.new + data.complaints.inProgress}</p><p className="text-xs text-gray-500 uppercase">Open</p></div>
            <div className="text-center"><p className="text-xl font-bold text-green-600">{data.complaints.resolved + data.complaints.closed}</p><p className="text-xs text-gray-500 uppercase">Resolved</p></div>
            <div className="text-center"><p className="text-xl font-bold text-red-600">{data.complaints.overdue}</p><p className="text-xs text-gray-500 uppercase">Overdue</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">Complaints by Status</p>
              <div className="h-48 border border-gray-100 rounded bg-gray-50 flex items-center justify-center p-2">
                <PieChart data={data.complaints.byStatus} colors={['#3b82f6', '#f59e0b', '#10b981', '#9ca3af', '#ef4444']} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">Complaint Trend</p>
              <div className="h-48 border border-gray-100 rounded bg-gray-50 flex items-center justify-center p-2">
                <BarChart data={data.complaints.trend} xKey="name" yKey="value" colors={['#f59e0b']} />
              </div>
            </div>
          </div>
        </Card>

        {/* Pump Analytics */}
        <Card className="p-5 flex flex-col min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 flex justify-between items-center">
            Pump Performance
            <Badge variant="success">{(data.pumps.working / data.pumps.total * 100).toFixed(1)}% Available</Badge>
          </h3>
          <div className="grid grid-cols-4 gap-2 py-4">
            <div className="text-center"><p className="text-xl font-bold text-gray-800">{data.pumps.total}</p><p className="text-[10px] text-gray-500 uppercase">Total</p></div>
            <div className="text-center"><p className="text-xl font-bold text-green-600">{data.pumps.working}</p><p className="text-[10px] text-gray-500 uppercase">Working</p></div>
            <div className="text-center"><p className="text-xl font-bold text-amber-600">{data.pumps.underMaintenance}</p><p className="text-[10px] text-gray-500 uppercase">In Maint.</p></div>
            <div className="text-center"><p className="text-xl font-bold text-red-600">{data.pumps.notWorking}</p><p className="text-[10px] text-gray-500 uppercase">Not Work.</p></div>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-2">Pump Status Distribution</p>
          <div className="h-48 mt-auto border border-gray-100 rounded bg-gray-50 flex items-center justify-center p-2">
            <PieChart data={data.pumps.statusDistribution} colors={['#10b981', '#f59e0b', '#ef4444']} />
          </div>
        </Card>

        {/* Water Quality & Maintenance Combined */}
        <div className="space-y-6 flex flex-col">
          <Card className="p-5 flex-1">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex justify-between items-center">
              Water Quality Overview
            </h3>
            <div className="flex gap-4 items-center mt-3">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1"><span className="text-sm text-gray-600">Safe</span><span className="font-bold text-green-600">{data.waterQuality.safe}</span></div>
                <div className="flex justify-between items-center mb-1"><span className="text-sm text-gray-600">Needs Attention</span><span className="font-bold text-amber-600">{data.waterQuality.needsAttention}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Critical</span><span className="font-bold text-red-600">{data.waterQuality.critical}</span></div>
              </div>
              <div className="h-28 w-28 shrink-0">
                <PieChart data={data.waterQuality.statusDistribution} colors={['#10b981', '#f59e0b', '#ef4444']} hideLegend />
              </div>
            </div>
          </Card>
          <Card className="p-5 flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex justify-between items-center">
              Maintenance Performance
            </h3>
            <div className="flex gap-4 items-center mt-3">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1"><span className="text-sm text-gray-600">Pending/In Prog.</span><span className="font-bold text-amber-600">{data.maintenance.pending + data.maintenance.inProgress}</span></div>
                <div className="flex justify-between items-center mb-1"><span className="text-sm text-gray-600">Completed</span><span className="font-bold text-green-600">{data.maintenance.completed}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Overdue/Emerg.</span><span className="font-bold text-red-600">{data.maintenance.overdue + data.maintenance.emergency}</span></div>
              </div>
              <div className="h-28 w-28 shrink-0">
                <PieChart data={[
                  {name: 'Open', value: data.maintenance.pending + data.maintenance.inProgress},
                  {name: 'Done', value: data.maintenance.completed},
                  {name: 'Critical', value: data.maintenance.overdue + data.maintenance.emergency}
                ]} colors={['#f59e0b', '#10b981', '#ef4444']} hideLegend />
              </div>
            </div>
          </Card>
        </div>

        {/* Fee Collection Analytics */}
        <Card className="p-5 xl:col-span-2 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 flex justify-between items-center">
            Fee Collection Performance
            <Badge variant={data.overview.feeCollectionRate > 70 ? "success" : "warning"}>{data.overview.feeCollectionRate}% Collected</Badge>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <div className="bg-gray-50 p-3 rounded border text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">Total Amount Due</p>
              <p className="text-xl font-bold text-gray-800">{formatCurrency(data.payments.amountDue)}</p>
            </div>
            <div className="bg-green-50 border-green-100 p-3 rounded border text-center">
              <p className="text-xs text-green-700 uppercase mb-1">Total Collected</p>
              <p className="text-xl font-bold text-green-800">{formatCurrency(data.payments.amountCollected)}</p>
            </div>
            <div className="bg-red-50 border-red-100 p-3 rounded border text-center">
              <p className="text-xs text-red-700 uppercase mb-1">Total Outstanding</p>
              <p className="text-xl font-bold text-red-800">{formatCurrency(data.payments.outstanding)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">Monthly Collection Trend</p>
              <div className="h-56 border border-gray-100 rounded bg-gray-50 flex items-center justify-center p-2">
                <BarChart data={data.payments.trend} xKey="name" yKey="value" colors={['#10b981']} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">Collection by Village</p>
              <div className="h-56 border border-gray-100 rounded bg-gray-50 flex items-center justify-center p-2">
                <BarChart data={data.payments.byVillage} xKey="name" yKey="value" colors={['#3b82f6']} />
              </div>
            </div>
          </div>
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
            {data.villagesPerformance.filter(v => v.overallStatus === 'Good').map(v => (
              <div key={v.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <h4 className="font-bold text-gray-900">{v.village}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Reliability: {v.supplyReliability}% | Coll.: {v.collectionRate}%</p>
                </div>
                <Badge variant="success">Excellent</Badge>
              </div>
            ))}
            {data.villagesPerformance.filter(v => v.overallStatus === 'Good').length === 0 && (
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
            {data.villagesPerformance.filter(v => v.overallStatus === 'Critical' || v.overallStatus === 'Needs Attention').map(v => (
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
          <Table columns={villageColumns} data={data.villagesPerformance} keyExtractor={row => row.id} />
        </div>
      </Card>
      
    </div>
  );
};

export default Analytics;
