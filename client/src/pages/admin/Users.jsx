import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { Search, Plus, Edit2, AlertCircle, Eye } from 'lucide-react';
import { mockUsers, villagesList } from '../../data/mockUsers';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'VILLAGER',
    village: 'All'
  });

  // Fetch users (mock API call)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        setUsers(mockUsers);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filtered Users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.phone.includes(searchTerm) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesVillage = villageFilter ? user.village === villageFilter : true;
    
    let matchesStatus = true;
    if (statusFilter === 'Active') matchesStatus = user.isActive === true;
    if (statusFilter === 'Inactive') matchesStatus = user.isActive === false;

    return matchesSearch && matchesRole && matchesVillage && matchesStatus;
  });

  // Handlers
  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setFormData({ name: '', phone: '', role: 'VILLAGER', village: 'All' });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, phone: user.phone, role: user.role, village: user.village });
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleOpenStatusConfirm = (user) => {
    setSelectedUser(user);
    setIsConfirmModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedUser) {
      // Edit User
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
    } else {
      // Add User
      const newUser = {
        id: `USR-${1000 + users.length + 1}`,
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([newUser, ...users]);
    }
    setIsFormModalOpen(false);
  };

  const handleToggleStatus = () => {
    setUsers(users.map(u => 
      u.id === selectedUser.id ? { ...u, isActive: !u.isActive } : u
    ));
    setIsConfirmModalOpen(false);
  };

  const columns = [
    { header: 'User ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Phone', accessor: 'phone' },
    { 
      header: 'Role', 
      accessor: 'role',
      render: (row) => (
        <Badge variant={row.role === 'ADMIN' ? 'primary' : row.role === 'OPERATOR' ? 'warning' : 'default'}>
          {row.role}
        </Badge>
      )
    },
    { header: 'Village', accessor: 'village' },
    { 
      header: 'Status', 
      accessor: 'isActive',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'danger'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    { header: 'Joined', accessor: 'createdAt' },
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
            className={`${row.isActive ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} text-xs font-medium border px-2 py-1 rounded`}
          >
            {row.isActive ? 'Deactivate' : 'Activate'}
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
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-500 text-sm">Administrators can view and manage all registered users across the platform.</p>
        </div>
        <Button onClick={handleOpenAddModal} className="flex items-center gap-2 whitespace-nowrap">
          <Plus size={18} /> Add New User
        </Button>
      </div>

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
              { label: 'Villager', value: 'VILLAGER' },
              { label: 'Operator', value: 'OPERATOR' },
              { label: 'Admin', value: 'ADMIN' },
            ]}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          />

          <Select
            options={[
              { label: 'All Villages', value: '' },
              ...villagesList.map(v => ({ label: v, value: v }))
            ]}
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
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
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        {/* Responsive Table wrapper handles empty states internally based on data length */}
        <Table columns={columns} data={filteredUsers} keyExtractor={row => row.id} />
      </Card>

      {/* Form Modal (Add/Edit) */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title={selectedUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
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
              { label: 'Villager', value: 'VILLAGER' },
              { label: 'Operator', value: 'OPERATOR' },
              { label: 'Admin', value: 'ADMIN' },
            ]}
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          />
          <Select 
            label="Village" 
            required
            options={villagesList.map(v => ({ label: v, value: v }))}
            value={formData.village}
            onChange={(e) => setFormData({...formData, village: e.target.value})}
          />
          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button variant="outline" type="button" onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
            <Button type="submit">{selectedUser ? 'Save Changes' : 'Add User'}</Button>
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
              Are you sure you want to <strong>{selectedUser?.isActive ? 'deactivate' : 'activate'}</strong> the account for <strong>{selectedUser?.name}</strong>?
            </p>
          </div>
          <p className="text-sm text-gray-600">
            {selectedUser?.isActive 
              ? "Deactivating this account will prevent the user from logging in to the system. You can reactivate it later."
              : "Activating this account will allow the user to log in and access the system normally."
            }
          </p>
          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
            <Button variant={selectedUser?.isActive ? 'danger' : 'primary'} onClick={handleToggleStatus}>
              Yes, {selectedUser?.isActive ? 'Deactivate' : 'Activate'}
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
              <span className="font-medium text-gray-900">{selectedUser.id}</span>
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
              <Badge variant={selectedUser.role === 'ADMIN' ? 'primary' : selectedUser.role === 'OPERATOR' ? 'warning' : 'default'}>
                {selectedUser.role}
              </Badge>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500 text-sm">Assigned Village</span>
              <span className="font-medium text-gray-900">{selectedUser.village}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500 text-sm">Status</span>
              <Badge variant={selectedUser.isActive ? 'success' : 'danger'}>
                {selectedUser.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-gray-500 text-sm">Joined Date</span>
              <span className="font-medium text-gray-900">{selectedUser.createdAt}</span>
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
