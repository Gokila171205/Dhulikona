import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import { 
  FileText, Download, Printer, RefreshCw, AlertCircle, FileOutput, CheckCircle, Search, Calendar, MapPin
} from 'lucide-react';
import api from '../../services/api';

const reportTypesList = [
  'Overall System Summary',
  'User Report',
  'Village Report',
  'System Activity / Audit Report'
];

const Reports = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters for generating a report
  const [selectedReportType, setSelectedReportType] = useState(reportTypesList[0]);
  
  // Dynamic filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // YYYY-MM-DD
  const [villageFilter, setVillageFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  // Pagination for report preview
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

  // Dropdown lookup lists
  const [villagesList, setVillagesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  
  // Preview State
  const [previewData, setPreviewData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Initialize empty report history log
        setHistory([]);
        
        // Fetch lookup lists for dropdowns
        const villagesRes = await api.get('/villages', { params: { limit: 100 } });
        
        const vList = villagesRes.data.map(v => v.name);
        const uniqueDistricts = [...new Set(villagesRes.data.map(v => v.district))];

        setVillagesList(vList);
        setDistrictsList(uniqueDistricts);
        setError(null);
      } catch (err) {
        setError('Failed to fetch filter data.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Reset pagination when filter values or report type change
  useEffect(() => {
    setPage(1);
    setPreviewData(null);
  }, [
    selectedReportType, searchTerm, statusFilter, roleFilter, moduleFilter,
    actionFilter, resultFilter, dateFilter, villageFilter, districtFilter
  ]);

  const handleClearFilters = () => {
    setSelectedReportType(reportTypesList[0]);
    setSearchTerm('');
    setStatusFilter('');
    setRoleFilter('');
    setModuleFilter('');
    setActionFilter('');
    setResultFilter('');
    setDateFilter('');
    setVillageFilter('');
    setDistrictFilter('');
    setPreviewData(null);
  };

  const handleGenerateReport = async (targetPage = 1) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      let endpoint = '';
      const params = {
        page: targetPage,
        limit
      };
      
      if (selectedReportType === 'Overall System Summary') {
        endpoint = '/reports/summary';
      } else if (selectedReportType === 'User Report') {
        endpoint = '/reports/users';
        if (searchTerm) params.search = searchTerm;
        if (roleFilter) params.role = roleFilter.toLowerCase();
        if (statusFilter) params.status = statusFilter;
        if (villageFilter) params.village = villageFilter;
      } else if (selectedReportType === 'Village Report') {
        endpoint = '/reports/villages';
        if (searchTerm) params.search = searchTerm;
        if (districtFilter) params.district = districtFilter;
        if (statusFilter) params.status = statusFilter;
      } else if (selectedReportType === 'System Activity / Audit Report') {
        endpoint = '/reports/activity';
        if (searchTerm) params.search = searchTerm;
        if (moduleFilter) params.module = moduleFilter.toUpperCase().replace(' ', '_');
        if (actionFilter) params.action = actionFilter.toUpperCase().replace(' ', '_');
        if (roleFilter) params.role = roleFilter.toLowerCase();
        if (resultFilter) params.result = resultFilter === 'Success' ? 'SUCCESS' : 'FAILED';
        if (villageFilter) params.village = villageFilter;
        if (dateFilter) params.date = dateFilter;
      }

      const res = await api.get(endpoint, { params });
      
      let formatted = null;
      if (selectedReportType === 'Overall System Summary') {
        const d = res.data;
        formatted = {
          summary: { 
            TotalUsers: d.users.total, 
            TotalVillages: d.villages.total, 
            TotalHouseholds: d.households.total,
            TotalAuditLogs: d.activity.total
          },
          columns: ['Metric', 'Total Count', 'Status'],
          data: [
            { Metric: 'Registered Users', Count: d.users.total, Status: 'Available' },
            { Metric: 'Managed Villages', Count: d.villages.total, Status: 'Available' },
            { Metric: 'Total Households', Count: d.households.total, Status: 'Available' },
            { Metric: 'Audit Logs Recorded', Count: d.activity.total, Status: 'Available' },
            { Metric: 'Water Pumps', Count: 'N/A', Status: 'Not yet available' },
            { Metric: 'Complaints', Count: 'N/A', Status: 'Not yet available' },
            { Metric: 'Water Supply Performance', Count: 'N/A', Status: 'Not yet available' },
            { Metric: 'Water Quality Tests', Count: 'N/A', Status: 'Not yet available' },
            { Metric: 'Fee Collections', Count: 'N/A', Status: 'Not yet available' }
          ]
        };
        setTotalPages(1);
        setTotalRecords(9);
      } else if (selectedReportType === 'User Report') {
        formatted = {
          summary: { TotalUsers: res.pagination?.total || 0 },
          columns: ['User ID', 'Name', 'Phone', 'Role', 'Village', 'Status', 'Registration Date'],
          data: res.data.map(u => ({
            'User ID': u.userId,
            Name: u.name,
            Phone: u.phone,
            Role: u.role.toUpperCase(),
            Village: u.village?.name || 'N/A',
            Status: u.status.toUpperCase(),
            'Registration Date': new Date(u.createdAt).toLocaleDateString()
          }))
        };
        setPage(res.pagination?.page || 1);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalRecords(res.pagination?.total || 0);
      } else if (selectedReportType === 'Village Report') {
        formatted = {
          summary: { TotalVillages: res.pagination?.total || 0 },
          columns: ['Village ID', 'Village Name', 'District', 'Block', 'Households', 'Assigned Operator', 'Status', 'Created Date'],
          data: res.data.map(v => ({
            'Village ID': v.villageId,
            'Village Name': v.name,
            District: v.district,
            Block: v.block,
            Households: v.households,
            'Assigned Operator': v.assignedOperator?.name || 'None',
            Status: v.status.toUpperCase(),
            'Created Date': new Date(v.createdAt).toLocaleDateString()
          }))
        };
        setPage(res.pagination?.page || 1);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalRecords(res.pagination?.total || 0);
      } else if (selectedReportType === 'System Activity / Audit Report') {
        formatted = {
          summary: { TotalActivities: res.pagination?.total || 0 },
          columns: ['Log ID', 'Date/Time', 'User', 'Role', 'Action', 'Module', 'Village', 'Description', 'Result'],
          data: res.data.map(log => ({
            'Log ID': log.logId,
            'Date/Time': new Date(log.createdAt).toLocaleString(),
            User: log.userName || log.userId?.name || 'System',
            Role: (log.role || log.userId?.role || 'system').toUpperCase(),
            Action: log.action,
            Module: log.module,
            Village: log.village || 'N/A',
            Description: log.description,
            Result: log.result
          }))
        };
        setPage(res.pagination?.page || 1);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalRecords(res.pagination?.total || 0);
      }

      setPreviewData(formatted);

      // Save record in local history
      const newHistoryRecord = {
        id: `RPT-00${history.length + 1}`,
        reportType: selectedReportType,
        generatedDate: new Date().toISOString(),
        generatedBy: 'Admin User',
        filters: JSON.stringify({
          searchTerm,
          statusFilter,
          roleFilter,
          moduleFilter,
          actionFilter,
          resultFilter,
          dateFilter,
          villageFilter,
          districtFilter
        }),
        status: 'Completed'
      };
      setHistory(h => [newHistoryRecord, ...h]);

    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate report.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    if (!previewData || !previewData.data) return;
    
    const headers = previewData.columns.join(',');
    const rows = previewData.data.map(obj => Object.values(obj).map(v => `"${v}"`).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedReportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Failed': return 'danger';
      case 'Processing': return 'warning';
      default: return 'default';
    }
  };

  const historyColumns = [
    { header: 'Report ID', accessor: 'id' },
    { header: 'Type', accessor: 'reportType' },
    { header: 'Date Generated', render: (row) => new Date(row.generatedDate).toLocaleString() },
    { header: 'Generated By', accessor: 'generatedBy' },
    { 
      header: 'Selected Filters', 
      render: (row) => {
        try {
          const f = JSON.parse(row.filters);
          const parts = [];
          if (f.searchTerm) parts.push(`Search: "${f.searchTerm}"`);
          if (f.roleFilter) parts.push(`Role: ${f.roleFilter}`);
          if (f.statusFilter) parts.push(`Status: ${f.statusFilter}`);
          if (f.villageFilter) parts.push(`Village: ${f.villageFilter}`);
          if (f.districtFilter) parts.push(`District: ${f.districtFilter}`);
          if (f.moduleFilter) parts.push(`Module: ${f.moduleFilter}`);
          if (f.actionFilter) parts.push(`Action: ${f.actionFilter}`);
          if (f.resultFilter) parts.push(`Result: ${f.resultFilter}`);
          if (f.dateFilter) parts.push(`Date: ${f.dateFilter}`);
          return parts.length > 0 ? parts.join(', ') : 'None';
        } catch (e) {
          return 'None';
        }
      } 
    },
    { 
      header: 'Status', 
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
          <button 
            className="text-gov-blue hover:underline text-sm font-medium"
            onClick={() => {
              try {
                const f = JSON.parse(row.filters);
                setSelectedReportType(row.reportType);
                setSearchTerm(f.searchTerm || '');
                setStatusFilter(f.statusFilter || '');
                setRoleFilter(f.roleFilter || '');
                setModuleFilter(f.moduleFilter || '');
                setActionFilter(f.actionFilter || '');
                setResultFilter(f.resultFilter || '');
                setDateFilter(f.dateFilter || '');
                setVillageFilter(f.villageFilter || '');
                setDistrictFilter(f.districtFilter || '');
                // Auto trigger run
                setTimeout(() => handleGenerateReport(1), 100);
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Re-run
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
        <span className="ml-2 text-gray-600">Loading reports module...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Non-printable Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports & Documents</h2>
          <p className="text-gray-500 text-sm mt-1">Generate operational reports for monitoring water supply, service quality, complaints, maintenance and fee collection across villages.</p>
        </div>
      </div>

      {/* Report Configuration Panel */}
      <Card className="p-5 print:hidden">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileOutput size={18} className="text-gov-blue" /> Configure New Report
        </h3>
        
        <div className="space-y-4">
          <div className="w-full">
            <Select
              label="Report Type"
              options={reportTypesList.map(rt => ({ label: rt, value: rt }))}
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
            />
          </div>
          
          {/* Dynamic Filters Grid */}
          {selectedReportType !== 'Overall System Summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
              {/* Common Search Filter */}
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Query</label>
                <input
                  type="text"
                  placeholder="Search name, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gov-blue focus:border-gov-blue text-sm"
                />
              </div>

              {/* User Report Specific Filters */}
              {selectedReportType === 'User Report' && (
                <>
                  <Select
                    label="Role"
                    options={[
                      { label: 'All Roles', value: '' },
                      { label: 'Admin', value: 'Admin' },
                      { label: 'Operator', value: 'Operator' },
                      { label: 'Villager', value: 'Villager' }
                    ]}
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  />
                  <Select
                    label="Status"
                    options={[
                      { label: 'All Statuses', value: '' },
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' }
                    ]}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  />
                  <Select
                    label="Village Context"
                    options={[{ label: 'All Villages', value: '' }, ...villagesList.map(v => ({ label: v, value: v }))]}
                    value={villageFilter}
                    onChange={(e) => setVillageFilter(e.target.value)}
                  />
                </>
              )}

              {/* Village Report Specific Filters */}
              {selectedReportType === 'Village Report' && (
                <>
                  <Select
                    label="District"
                    options={[{ label: 'All Districts', value: '' }, ...districtsList.map(d => ({ label: d, value: d }))]}
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                  />
                  <Select
                    label="Status"
                    options={[
                      { label: 'All Statuses', value: '' },
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' }
                    ]}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  />
                </>
              )}

              {/* System Activity Specific Filters */}
              {selectedReportType === 'System Activity / Audit Report' && (
                <>
                  <Select
                    label="Module"
                    options={[
                      { label: 'All Modules', value: '' },
                      { label: 'Authentication', value: 'Authentication' },
                      { label: 'Users', value: 'Users' },
                      { label: 'Villages', value: 'Villages' }
                    ]}
                    value={moduleFilter}
                    onChange={(e) => setModuleFilter(e.target.value)}
                  />
                  <Select
                    label="Action"
                    options={[
                      { label: 'All Actions', value: '' },
                      { label: 'Login', value: 'Login' },
                      { label: 'Create', value: 'Create' },
                      { label: 'Update', value: 'Update' },
                      { label: 'Delete', value: 'Delete' },
                      { label: 'Status Change', value: 'Status Change' }
                    ]}
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                  />
                  <Select
                    label="User Role"
                    options={[
                      { label: 'All Roles', value: '' },
                      { label: 'Admin', value: 'Admin' },
                      { label: 'Operator', value: 'Operator' },
                      { label: 'Villager', value: 'Villager' }
                    ]}
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  />
                  <Select
                    label="Result"
                    options={[
                      { label: 'All Results', value: '' },
                      { label: 'Success', value: 'Success' },
                      { label: 'Failed', value: 'Failed' }
                    ]}
                    value={resultFilter}
                    onChange={(e) => setResultFilter(e.target.value)}
                  />
                  <Select
                    label="Village Context"
                    options={[{ label: 'All Villages', value: '' }, ...villagesList.map(v => ({ label: v, value: v }))]}
                    value={villageFilter}
                    onChange={(e) => setVillageFilter(e.target.value)}
                  />
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gov-blue focus:border-gov-blue text-sm"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-6 flex flex-wrap justify-between items-center border-t border-gray-100 pt-4">
          <button 
            onClick={handleClearFilters}
            className="text-sm text-gray-500 hover:text-gov-blue flex items-center gap-1 font-medium"
          >
            <RefreshCw size={14} /> Reset Configuration
          </button>
          
          <Button 
            onClick={() => handleGenerateReport(1)} 
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Generating...</>
            ) : (
              <><FileText size={16} /> Generate Report</>
            )}
          </Button>
        </div>
      </Card>

      {/* Report Preview Section (Printable Area) */}
      {previewData ? (
        <Card className="p-0 overflow-hidden shadow-lg border-gray-300 print:shadow-none print:border-none print:m-0 print:p-0">
          {/* Action Bar (Hidden when printing) */}
          <div className="bg-gray-50 border-b border-gray-200 p-3 flex justify-between items-center print:hidden">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle size={18} />
              <span className="text-sm font-semibold">Report Generated Successfully</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1">
                <Printer size={14} /> Print
              </Button>
              <Button size="sm" onClick={handleDownloadCSV} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700">
                <Download size={14} /> Download CSV
              </Button>
            </div>
          </div>

          {/* Printable Report Content */}
          <div className="p-8 bg-white print:p-0">
            {/* Report Header */}
            <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-widest mb-2">JALTRACK</h1>
              <h2 className="text-xl font-semibold text-gray-700">{selectedReportType}</h2>
              <p className="text-sm text-gray-500 mt-2">Generated on: {new Date().toLocaleString()}</p>
            </div>
            
            {/* Report Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-sm bg-gray-50 p-4 rounded border border-gray-150">
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700 w-32">Search Query:</span>
                <span className="text-gray-900">{searchTerm || 'None'}</span>
              </div>
              {selectedReportType === 'User Report' && (
                <>
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-700 w-32">Role Filter:</span>
                    <span className="text-gray-900">{roleFilter || 'All Roles'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-700 w-32">Status Filter:</span>
                    <span className="text-gray-900">{statusFilter || 'All Statuses'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-700 w-32">Village Scope:</span>
                    <span className="text-gray-900">{villageFilter || 'All Villages'}</span>
                  </div>
                </>
              )}
              {selectedReportType === 'Village Report' && (
                <>
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-700 w-32">District Scope:</span>
                    <span className="text-gray-900">{districtFilter || 'All Districts'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-700 w-32">Status Filter:</span>
                    <span className="text-gray-900">{statusFilter || 'All Statuses'}</span>
                  </div>
                </>
              )}
              {selectedReportType === 'System Activity / Audit Report' && (
                <>
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-700 w-32">Module Scope:</span>
                    <span className="text-gray-900">{moduleFilter || 'All Modules'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-700 w-32">Action Scope:</span>
                    <span className="text-gray-900">{actionFilter || 'All Actions'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-700 w-32">Role Scope:</span>
                    <span className="text-gray-900">{roleFilter || 'All Roles'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-700 w-32">Result Scope:</span>
                    <span className="text-gray-900">{resultFilter || 'All Results'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-700 w-32">Village Scope:</span>
                    <span className="text-gray-900">{villageFilter || 'All Villages'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-700 w-32">Date:</span>
                    <span className="text-gray-900">{dateFilter || 'All Time'}</span>
                  </div>
                </>
              )}
            </div>

            {/* Summary Statistics */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">Summary Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(previewData.summary).map(([key, value], idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Table */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">Detailed Breakdown</h3>
              {previewData.data.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 border border-dashed rounded-lg">
                  <AlertCircle size={36} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 font-medium">No report data found for the selected filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        {previewData.columns.map((col, idx) => (
                          <th key={idx} className="border-b border-gray-200 p-3 font-semibold text-gray-700">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.data.map((row, idx) => {
                        const rowKey = row['User ID'] || row['Village ID'] || row['Log ID'] || row['Metric'] || idx;
                        return (
                          <tr key={rowKey} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                            {Object.values(row).map((val, vIdx) => (
                              <td key={vIdx} className="p-3 text-gray-800">{val}</td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-12 text-center text-sm text-gray-400 print:block">
              --- End of Report ---
            </div>
          </div>

          {/* Pagination Controls for Preview */}
          {selectedReportType !== 'Overall System Summary' && totalRecords > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 border-t border-gray-150 print:hidden">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * limit, totalRecords)}</span> of{' '}
                <span className="font-medium">{totalRecords}</span> records
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateReport(Math.max(1, page - 1))}
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
                    onClick={() => handleGenerateReport(Math.min(totalPages, page + 1))}
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
      ) : (
        <Card className="p-12 flex flex-col items-center justify-center text-center bg-gray-50/50 border-dashed print:hidden">
          <FileText size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No report generated yet</h3>
          <p className="text-gray-500 text-sm mt-1 max-w-md">Select your preferred report type and filters above, then click 'Generate Report' to view the preview here.</p>
        </Card>
      )}

      {/* Recent Reports History (Hidden when printing) */}
      <Card className="print:hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Calendar size={18} className="text-gray-500" /> Recent Reports History
          </h3>
        </div>
        <div className="overflow-x-auto">
          {history.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              No reports have been generated in this session.
            </div>
          ) : (
            <Table columns={historyColumns} data={history} keyExtractor={row => row.id} />
          )}
        </div>
      </Card>
      
    </div>
  );
};

export default Reports;
