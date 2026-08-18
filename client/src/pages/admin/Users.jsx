import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { Search, Plus, Edit2, AlertCircle, Eye, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [villagesList, setVillagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [formError, setFormError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    phone: '',
    role: 'villager',
    village: ''
  });

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersRes, villagesRes] = await Promise.all([
        api.get('/users', {
          params: {
            search: searchTerm,
            role: roleFilter,
            village: villageFilter,
            status: statusFilter,
            page,
            limit
          }
        }),
        api.get('/villages', { params: { limit: 100 } })
      ]);
      setUsers(usersRes.data);
      setTotalPages(usersRes.pagination?.totalPages || 1);
      setTotalUsers(usersRes.pagination?.total || 0);
      setVillagesList(villagesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 1 when filters change to prevent empty states
  useEffect(() => {
    setPage(1);
  }, [searchTerm, roleFilter, villageFilter, statusFilter]);

  useEffect(() => {
    // Add simple debounce for search
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, roleFilter, villageFilter, statusFilter, page]);

  // Frontend filter is no longer needed since the API does it, but we can keep it as passthrough
  const filteredUsers = users;

  // Handlers
  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setFormData({ userId: '', name: '', phone: '', role: 'villager', village: '' });
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      userId: user.userId || '',
      name: user.name,
      phone: user.phone,
      role: user.role,
      village: user.village?._id || user.village || ''
    });
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = async (user) => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${user._id || user.id}`);
      setSelectedUser(res.data);
      setIsViewModalOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch user details.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusConfirm = (user) => {
    setSelectedUser(user);
    setIsConfirmModalOpen(true);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);
    try {
      if (selectedUser) {
        // Edit User
        await api.put(`/users/${selectedUser._id || selectedUser.id}`, formData);
        showSuccess('User updated successfully!');
      } else {
        // Add User
        // Need a random password for new user in API, so we provide one
        await api.post('/users', { ...formData, password: 'password123' });
        showSuccess('User created successfully!');
      }
      setIsFormModalOpen(false);
      fetchData(page); // Refresh data
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save user.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsSaving(true);
    try {
      await api.patch(`/users/${selectedUser._id || selectedUser.id}/status`, {
        status: selectedUser.status === 'active' ? 'inactive' : 'active'
      });
      showSuccess(`User ${selectedUser.status === 'active' ? 'deactivated' : 'activated'} successfully!`);
      setIsConfirmModalOpen(false);
      fetchData(page); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change status.');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    { header: 'User ID', accessor: 'userId' },
    { header: 'Name', accessor: 'name' },
    { header: 'Phone', accessor: 'phone' },
    { 
      header: 'Role', 
      accessor: 'role',
      render: (row) => (
        <Badge variant={row.role === 'admin' ? 'primary' : row.role === 'operator' ? 'warning' : 'default'}>
          {row.role.toUpperCase()}
        </Badge>
      )
    },
    { 
      header: 'Village', 
      accessor: 'village',
      render: (row) => row.village?.name || 'N/A'
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
      header: 'Joined', 
      accessor: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenViewModal(row)} className="text-gray-500 hover:text-gov-blue" title="View">
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
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center max-w-md mx-auto bg-red-50 text-red-700 rounded-lg border border-red-200 mt-10 space-y-4">
        <AlertCircle className="mx-auto text-red-500" size={48} />
        <h3 className="text-lg font-bold">Error</h3>
        <p className="text-sm">{error}</p>
        <Button variant="primary" onClick={() => fetchData(page)}>
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-500 text-sm">Administrators can view and manage all registered users across the platform.</p>
        </div>
        <Button onClick={handleOpenAddModal} className="flex items-center gap-2 whitespace-nowrap">
          <Plus size={18} /> Add New User
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <Input 
              placeholder="Search by name, phone or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            options={[
              { label: 'All Roles', value: '' },
              { label: 'Villager', value: 'villager' },
              { label: 'Operator', value: 'operator' },
              { label: 'Admin', value: 'admin' },
            ]}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          />

          <Select
            options={[
              { label: 'All Villages', value: '' },
              ...villagesList.map(v => ({ label: v.name, value: v._id }))
            ]}
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
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
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        {/* Responsive Table wrapper handles empty states internally based on data length */}
        <Table columns={columns} data={filteredUsers} keyExtractor={row => row._id || row.id} />
        
        {/* Pagination Controls */}
        {totalUsers > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 border-t border-gray-150">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * limit, totalUsers)}</span> of{' '}
              <span className="font-medium">{totalUsers}</span> users
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
        title={selectedUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
              {formError}
            </div>
          )}
          <Input 
            label="User ID" 
            required 
            disabled={!!selectedUser}
            value={formData.userId}
            onChange={(e) => setFormData({...formData, userId: e.target.value})}
            placeholder="e.g. U-VIL-003"
          />
          <Input 
            label="Full Name" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Phone Number" 
            required 
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit phone number"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <Select 
            label="Role" 
            required
            options={[
              { label: 'Villager', value: 'villager' },
              { label: 'Operator', value: 'operator' },
              { label: 'Admin', value: 'admin' },
            ]}
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          />
          <Select 
            label="Village (Optional for Admins)" 
            options={[
              { label: 'Select Village', value: '' },
              ...villagesList.map(v => ({ label: v.name, value: v._id }))
            ]}
            value={formData.village || ''}
            onChange={(e) => setFormData({...formData, village: e.target.value})}
          />
          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button variant="outline" type="button" onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Status Confirmation Modal */}
      <Modal 
        isOpen={isConfirmModalOpen} 
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Status Change"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Are you sure you want to {selectedUser?.status === 'active' ? 'deactivate' : 'activate'}{' '}
            <span className="font-semibold text-gray-800">{selectedUser?.name}</span>?
          </p>
          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
            <Button 
              variant="danger" 
              onClick={handleToggleStatus}
              disabled={isSaving}
            >
              {isSaving ? 'Processing...' : (selectedUser?.status === 'active' ? 'Deactivate' : 'Activate')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* View User Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500 text-sm">User ID</span>
              <span className="font-medium text-gray-900">{selectedUser.userId}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500 text-sm">Name</span>
              <span className="font-medium text-gray-900">{selectedUser.name}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500 text-sm">Phone Number</span>
              <span className="font-medium text-gray-900">{selectedUser.phone}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500 text-sm">Role</span>
              <Badge variant={selectedUser.role === 'admin' ? 'primary' : selectedUser.role === 'operator' ? 'warning' : 'default'}>
                {selectedUser.role.toUpperCase()}
              </Badge>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500 text-sm">Assigned Village</span>
              <span className="font-medium text-gray-900">{selectedUser.village?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500 text-sm">Status</span>
              <Badge variant={selectedUser.status === 'active' ? 'success' : 'danger'}>
                {selectedUser.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-gray-500 text-sm">Joined Date</span>
              <span className="font-medium text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="pt-4 flex justify-end border-t">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
