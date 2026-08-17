import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import BarChart from '../../components/charts/BarChart';
import { 
  FileText, Search, RefreshCw, Eye, ShieldCheck, Activity, User, 
  MapPin, Clock, Info, CheckCircle, XCircle, ChevronDown, ArrowDown
} from 'lucide-react';
import { roleOptions, moduleOptions, actionOptions, resultOptions, dateRangeOptions } from '../../data/mockAuditLogs';
import api from '../../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const limit = 10;

  // Stats data for summaries and chart
  const [allLogsForStats, setAllLogsForStats] = useState([]);

  // Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const [villagesList, setVillagesList] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit
      };

      if (searchTerm) params.search = searchTerm;
      if (roleFilter) params.role = roleFilter.toLowerCase();
      if (moduleFilter) params.module = moduleFilter.toUpperCase().replace(' ', '_');
      if (actionFilter) params.action = actionFilter.toUpperCase().replace(' ', '_');
      if (resultFilter) params.result = resultFilter === 'Success' ? 'SUCCESS' : 'FAILED';
      if (villageFilter) params.village = villageFilter;
      if (dateFilter) params.date = dateFilter;

      const [logsRes, villagesRes, statsRes] = await Promise.all([
        api.get('/audit-logs', { params }),
        api.get('/villages', { params: { limit: 100 } }),
        api.get('/audit-logs', { params: { limit: 1000 } })
      ]);

      setLogs(logsRes.data);
      setTotalPages(logsRes.pagination?.totalPages || 1);
      setTotalLogs(logsRes.pagination?.total || 0);
      setVillagesList(villagesRes.data);
      setAllLogsForStats(statsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch audit logs.');
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 1 when filters change to prevent empty states
  useEffect(() => {
    setPage(1);
  }, [searchTerm, roleFilter, moduleFilter, actionFilter, resultFilter, villageFilter, dateFilter]);

  useEffect(() => {
    // Add simple debounce for search
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, roleFilter, moduleFilter, actionFilter, resultFilter, villageFilter, dateFilter, page]);

  // Filter Logic
  const filteredLogs = logs;

  // Summary Calculations
  const totalActivities = totalLogs;
  const todaysActivities = allLogsForStats.filter(log => new Date(log.createdAt).toDateString() === new Date().toDateString()).length;
  const adminActions = allLogsForStats.filter(log => (log.role || log.userId?.role) === 'admin').length;
  const operatorActions = allLogsForStats.filter(log => (log.role || log.userId?.role) === 'operator').length;
  const successfulActions = allLogsForStats.filter(log => log.result?.toUpperCase() === 'SUCCESS').length;
  const failedActions = allLogsForStats.filter(log => log.result?.toUpperCase() === 'FAILED').length;

  // Chart Data: Activity by Module
  const activityByModuleData = moduleOptions.map(mod => ({
    name: mod,
    value: allLogsForStats.filter(log => log.module?.toUpperCase() === mod.toUpperCase()).length
  })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setModuleFilter('');
    setActionFilter('');
    setResultFilter('');
    setVillageFilter('');
    setDateFilter('');
  };

  const handleView = async (log) => {
    try {
      setLoading(true);
      const res = await api.get(`/audit-logs/${log._id || log.id}`);
      setSelectedLog(res.data);
      setIsViewModalOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch audit log details.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'AM' : 'PM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day} ${month} ${year} · ${hours}:${minutes} ${ampm}`;
  };

  const getRoleBadgeVariant = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'danger';
      case 'operator': return 'primary';
      case 'villager': return 'default';
      default: return 'default';
    }
  };

  const getResultBadgeVariant = (result) => {
    switch (result?.toUpperCase()) {
      case 'SUCCESS': return 'success';
      case 'FAILED': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    { header: 'Log ID', accessor: 'logId' },
    { 
      header: 'Date & Time', 
      render: (row) => (
        <span className="text-gray-900 text-xs font-medium">
          {formatDateTime(row.createdAt)}
        </span>
      )
    },
    { 
      header: 'User', 
      render: (row) => (
        <div>
          <span className="font-semibold text-gray-800 block">{row.userName || row.userId?.name || 'System'}</span>
          <span className="block text-[10px] text-gray-500">{row.userId?.userId || 'SYS'}</span>
        </div>
      )
    },
    { 
      header: 'Role', 
      render: (row) => (
        <Badge variant={getRoleBadgeVariant(row.role || row.userId?.role)}>
          {(row.role || row.userId?.role || 'system').toUpperCase()}
        </Badge>
      )
    },
    { 
      header: 'Action', 
      render: (row) => (
        <Badge variant="default">
          {row.action}
        </Badge>
      )
    },
    { header: 'Module', accessor: 'module' },
    { 
      header: 'Result', 
      render: (row) => (
        <Badge variant={getResultBadgeVariant(row.result)}>
          {row.result?.toUpperCase()}
        </Badge>
      )
    },
    {
      header: 'Details',
      render: (row) => (
        <button onClick={() => handleView(row)} className="text-gray-500 hover:text-gov-blue p-1 rounded hover:bg-blue-50 transition-colors" title="View Log Details">
          <Eye size={18} />
        </button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
        <span className="ml-2 text-gray-600">Loading audit history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center max-w-md mx-auto bg-red-50 text-red-700 rounded-lg border border-red-200 mt-10 space-y-4">
        <AlertTriangle className="mx-auto text-red-500" size={48} />
        <h3 className="text-lg font-bold">Error</h3>
        <p className="text-sm">{error}</p>
        <Button variant="primary" onClick={() => fetchData()}>
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck size={24} className="text-gov-blue" /> Audit Logs
          </h2>
          <p className="text-gray-500 text-sm mt-1">Track important system activities and administrative actions to support transparency, accountability and system monitoring.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <Card className="p-3 bg-gray-50 border-gray-200 text-center flex flex-col justify-center items-center">
          <h3 className="text-xl font-bold text-gray-800">{totalActivities}</h3>
          <p className="text-[10px] font-semibold uppercase text-gray-500 mt-1">Total Logs</p>
        </Card>
        <Card className="p-3 bg-blue-50 border-blue-200 text-center flex flex-col justify-center items-center">
          <h3 className="text-xl font-bold text-blue-800">{todaysActivities}</h3>
          <p className="text-[10px] font-semibold uppercase text-blue-600 mt-1">Today</p>
        </Card>
        <Card className="p-3 bg-purple-50 border-purple-200 text-center flex flex-col justify-center items-center">
          <h3 className="text-xl font-bold text-purple-800">{adminActions}</h3>
          <p className="text-[10px] font-semibold uppercase text-purple-600 mt-1">Admin Actions</p>
        </Card>
        <Card className="p-3 bg-indigo-50 border-indigo-200 text-center flex flex-col justify-center items-center">
          <h3 className="text-xl font-bold text-indigo-800">{operatorActions}</h3>
          <p className="text-[10px] font-semibold uppercase text-indigo-600 mt-1">Operator Actions</p>
        </Card>
        <Card className="p-3 bg-green-50 border-green-200 text-center flex flex-col justify-center items-center">
          <h3 className="text-xl font-bold text-green-700">{successfulActions}</h3>
          <p className="text-[10px] font-semibold uppercase text-green-600 mt-1">Successful</p>
        </Card>
        <Card className="p-3 bg-red-50 border-red-200 text-center flex flex-col justify-center items-center">
          <h3 className="text-xl font-bold text-red-700">{failedActions}</h3>
          <p className="text-[10px] font-semibold uppercase text-red-600 mt-1">Failed</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Interface */}
        <div className="xl:col-span-3 space-y-4 flex flex-col h-full">
          {/* Filters */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
              <div className="relative lg:col-span-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <Input 
                  placeholder="Search logs..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                options={[{ label: 'All Roles', value: '' }, ...roleOptions.map(r => ({ label: r, value: r }))]}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              />

              <Select
                options={[{ label: 'All Modules', value: '' }, ...moduleOptions.map(m => ({ label: m, value: m }))]}
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
              />
              
              <Select
                options={[{ label: 'All Actions', value: '' }, ...actionOptions.map(a => ({ label: a, value: a }))]}
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              />

              <Select
                options={[{ label: 'All Results', value: '' }, ...resultOptions.map(r => ({ label: r, value: r }))]}
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
              />

              <Select
                options={[{ label: 'All Villages', value: '' }, ...villagesList.map(v => ({ label: v.name, value: v.name }))]}
                value={villageFilter}
                onChange={(e) => setVillageFilter(e.target.value)}
              />

              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            
            {(searchTerm || roleFilter || moduleFilter || actionFilter || resultFilter || villageFilter || dateFilter) && (
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
          <Card className="overflow-hidden flex-1 flex flex-col justify-between">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <ShieldCheck size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No logs found</h3>
                <p className="text-gray-500 text-sm mt-1">No audit activities match your current filters.</p>
              </div>
            ) : (
              <div>
                <Table columns={columns} data={filteredLogs} keyExtractor={row => row._id || row.id} />
                
                {/* Pagination Controls */}
                {totalLogs > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 border-t border-gray-150">
                    <div className="text-sm text-gray-500">
                      Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(page * limit, totalLogs)}</span> of{' '}
                      <span className="font-medium">{totalLogs}</span> audit logs
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
              </div>
            )}
          </Card>
        </div>

        {/* Side Panels */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Recent System Activity */}
          <Card className="p-4 border-gray-200 shadow-sm flex flex-col">
            <h3 className="text-[14px] font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Activity size={16} className="text-gov-blue"/> Recent Activity
            </h3>
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-1">
              {logs.slice(0, 5).map(log => (
                <div key={log._id || log.logId} className="relative pl-4 border-l-2 border-blue-200 pb-1">
                  <div className="absolute w-2 h-2 bg-gov-blue rounded-full -left-[5px] top-1"></div>
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="text-[10px] font-bold text-gov-blue">{formatDateTime(log.createdAt)}</span>
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-1 rounded">{log.module}</span>
                  </div>
                  <p className="text-xs text-gray-800 leading-tight">
                    <span className="font-semibold text-gray-900">{log.userId?.role || 'system'}</span> {log.action.toLowerCase()} {log.description.toLowerCase().replace('updated ', '').replace('recorded ', '').replace('submitted ', '')}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity By Module Chart */}
          <Card className="p-4 border-gray-200 shadow-sm">
            <h3 className="text-[14px] font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              Activity by Module
            </h3>
            <div className="h-48 flex items-center justify-center pt-2">
              <BarChart 
                data={activityByModuleData} 
                xKey="name" 
                yKey="value" 
                colors={['#6366f1', '#8b5cf6', '#3b82f6', '#14b8a6', '#f59e0b']}
              />
            </div>
          </Card>
        </div>

      </div>

      {/* View Details Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        title="Audit Log Details"
        className="max-w-2xl"
      >
        {selectedLog && (
          <div className="space-y-6">
            
            {/* Header Info */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Activity Log Record</h3>
                <p className="text-sm text-gray-500 font-mono mt-1">ID: {selectedLog.logId}</p>
              </div>
              <Badge variant={getResultBadgeVariant(selectedLog.result)}>
                {selectedLog.result}
              </Badge>
            </div>

            {/* Transparency Timeline */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Transparency Timeline</h4>
              
              <div className="flex flex-col items-center justify-center space-y-1">
                
                {/* Step 1: User */}
                <div className="flex items-center gap-3 w-64 bg-white border border-gray-200 shadow-sm p-2 rounded justify-center">
                  <User size={16} className={(selectedLog.role || selectedLog.userId?.role) === 'admin' ? 'text-red-500' : 'text-blue-500'} />
                  <span className="font-semibold text-gray-800">{selectedLog.userName || selectedLog.userId?.name || 'System'} <span className="text-xs font-normal text-gray-500">({(selectedLog.role || selectedLog.userId?.role || 'system').toUpperCase()})</span></span>
                </div>
                
                <ArrowDown size={16} className="text-gray-300" />
                
                {/* Step 2: Action */}
                <div className="flex items-center gap-3 w-64 bg-white border border-gray-200 shadow-sm p-2 rounded justify-center">
                  <Activity size={16} className="text-gray-600" />
                  <span className="font-semibold text-gray-800">{selectedLog.action}</span>
                </div>
                
                <ArrowDown size={16} className="text-gray-300" />
                
                {/* Step 3: Module */}
                <div className="flex items-center gap-3 w-64 bg-white border border-gray-200 shadow-sm p-2 rounded justify-center">
                  <FileText size={16} className="text-amber-500" />
                  <span className="font-semibold text-gray-800">{selectedLog.module}</span>
                </div>
                
                <ArrowDown size={16} className="text-gray-300" />
                
                {/* Step 4: Result */}
                <div className={`flex items-center gap-3 w-64 border shadow-sm p-2 rounded justify-center ${selectedLog.result === 'Success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  {selectedLog.result === 'Success' ? <CheckCircle size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-600" />}
                  <span className={`font-bold ${selectedLog.result === 'Success' ? 'text-green-800' : 'text-red-800'}`}>{selectedLog.result}</span>
                </div>

              </div>
            </div>

            {/* Detailed Properties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border border-gray-100 rounded p-4">
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-gray-500 flex items-center gap-1 mb-1"><Clock size={14} /> Timestamp</span>
                  <span className="font-medium text-gray-900">{formatDateTime(selectedLog.createdAt)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 flex items-center gap-1 mb-1"><User size={14} /> User ID</span>
                  <span className="font-medium text-gray-900">{selectedLog.userId?.userId || 'SYS'}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-gray-500 flex items-center gap-1 mb-1"><MapPin size={14} /> Village Context</span>
                  <span className="font-medium text-gray-900">{selectedLog.village || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 flex items-center gap-1 mb-1"><Info size={14} /> Related Record ID</span>
                  <span className="font-medium text-gov-blue bg-blue-50 px-2 py-0.5 rounded self-start">{selectedLog.relatedRecordId || 'N/A'}</span>
                </div>
              </div>
              
              <div className="md:col-span-2 mt-2 pt-3 border-t border-gray-100">
                <span className="text-gray-500 flex items-center gap-1 mb-1"><FileText size={14} /> Description details</span>
                <p className="font-medium text-gray-800 leading-relaxed bg-gray-50 p-2 rounded">{selectedLog.description}</p>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end gap-3">
              <Button onClick={() => setIsViewModalOpen(false)}>Close Log</Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default AuditLogs;
