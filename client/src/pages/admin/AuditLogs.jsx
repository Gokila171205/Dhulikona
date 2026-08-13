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
import { 
  mockAuditLogs, roleOptions, moduleOptions, actionOptions, resultOptions, dateRangeOptions 
} from '../../data/mockAuditLogs';
import { villagesList } from '../../data/mockUsers';

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
  const [dateFilter, setDateFilter] = useState(dateRangeOptions[1]); // Last 7 Days Default

  // Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setLogs(mockAuditLogs);
        setError(null);
      } catch (err) {
        setError('Failed to fetch audit logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Filter Logic
  const filteredLogs = logs.filter(log => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      log.id.toLowerCase().includes(searchLower) || 
      log.userName.toLowerCase().includes(searchLower) ||
      log.userId.toLowerCase().includes(searchLower) ||
      log.description.toLowerCase().includes(searchLower);
    
    const matchesRole = roleFilter ? log.role === roleFilter : true;
    const matchesModule = moduleFilter ? log.module === moduleFilter : true;
    const matchesAction = actionFilter ? log.action === actionFilter : true;
    const matchesResult = resultFilter ? log.result === resultFilter : true;
    const matchesVillage = villageFilter ? log.village === villageFilter : true;
    
    // In a real app date matching would happen here based on ISO strings
    
    return matchesSearch && matchesRole && matchesModule && matchesAction && matchesResult && matchesVillage;
  });

  // Summary Calculations
  const totalActivities = logs.length;
  // Mock today's count based on the first few items matching today's date
  const todaysActivities = logs.filter(log => new Date(log.dateTime).toDateString() === new Date('2026-08-13').toDateString()).length;
  const adminActions = logs.filter(log => log.role === 'Admin').length;
  const operatorActions = logs.filter(log => log.role === 'Operator').length;
  const successfulActions = logs.filter(log => log.result === 'Success').length;
  const failedActions = logs.filter(log => log.result === 'Failed').length;

  // Chart Data: Activity by Module
  const activityByModuleData = moduleOptions.map(mod => ({
    name: mod,
    value: logs.filter(log => log.module === mod).length
  })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setModuleFilter('');
    setActionFilter('');
    setResultFilter('');
    setVillageFilter('');
    setDateFilter(dateRangeOptions[1]);
  };

  const handleView = (log) => {
    setSelectedLog(log);
    setIsViewModalOpen(true);
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'Admin': return 'danger';
      case 'Operator': return 'primary';
      case 'Villager': return 'default';
      default: return 'default';
    }
  };

  const getResultBadgeVariant = (result) => {
    switch (result) {
      case 'Success': return 'success';
      case 'Failed': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    { header: 'Log ID', accessor: 'id' },
    { 
      header: 'Date & Time', 
      render: (row) => (
        <div>
          <span className="block text-gray-900">{new Date(row.dateTime).toLocaleDateString()}</span>
          <span className="block text-[10px] text-gray-500">{new Date(row.dateTime).toLocaleTimeString()}</span>
        </div>
      )
    },
    { 
      header: 'User', 
      render: (row) => (
        <div>
          <span className="font-semibold text-gray-800">{row.userName}</span>
          <span className="block text-[10px] text-gray-500">{row.userId}</span>
        </div>
      )
    },
    { 
      header: 'Role', 
      render: (row) => (
        <Badge variant={getRoleBadgeVariant(row.role)}>
          {row.role}
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
    { header: 'Village', accessor: 'village' },
    { 
      header: 'Result', 
      render: (row) => (
        <Badge variant={getResultBadgeVariant(row.result)}>
          {row.result}
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
                options={[{ label: 'All Villages', value: '' }, ...villagesList.map(v => ({ label: v, value: v }))]}
                value={villageFilter}
                onChange={(e) => setVillageFilter(e.target.value)}
              />

              <Select
                options={dateRangeOptions.map(d => ({ label: d, value: d }))}
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            
            {(searchTerm || roleFilter || moduleFilter || actionFilter || resultFilter || villageFilter || dateFilter !== dateRangeOptions[1]) && (
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
          <Card className="overflow-hidden flex-1">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <ShieldCheck size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No logs found</h3>
                <p className="text-gray-500 text-sm mt-1">No audit activities match your current filters.</p>
              </div>
            ) : (
              <Table columns={columns} data={filteredLogs} keyExtractor={row => row.id} />
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
                <div key={log.id} className="relative pl-4 border-l-2 border-blue-200 pb-1">
                  <div className="absolute w-2 h-2 bg-gov-blue rounded-full -left-[5px] top-1"></div>
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="text-[10px] font-bold text-gov-blue">{new Date(log.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-1 rounded">{log.module}</span>
                  </div>
                  <p className="text-xs text-gray-800 leading-tight">
                    <span className="font-semibold text-gray-900">{log.role}</span> {log.action.toLowerCase()} {log.description.toLowerCase().replace('updated ', '').replace('recorded ', '').replace('submitted ', '')}
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
                <p className="text-sm text-gray-500 font-mono mt-1">ID: {selectedLog.id}</p>
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
                  <User size={16} className={selectedLog.role === 'Admin' ? 'text-red-500' : 'text-blue-500'} />
                  <span className="font-semibold text-gray-800">{selectedLog.userName} <span className="text-xs font-normal text-gray-500">({selectedLog.role})</span></span>
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
                  <span className="font-medium text-gray-900">{new Date(selectedLog.dateTime).toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 flex items-center gap-1 mb-1"><User size={14} /> User ID</span>
                  <span className="font-medium text-gray-900">{selectedLog.userId}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-gray-500 flex items-center gap-1 mb-1"><MapPin size={14} /> Village Context</span>
                  <span className="font-medium text-gray-900">{selectedLog.village}</span>
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
