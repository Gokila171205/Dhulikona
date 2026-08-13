import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';

// Placeholders for other pages
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <h2 className="text-2xl font-semibold text-gray-500">{title} - Coming Soon</h2>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<DashboardLayout role="ADMIN" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="villages" element={<Placeholder title="Villages Management" />} />
        <Route path="users" element={<Placeholder title="Users Management" />} />
        <Route path="pumps" element={<Placeholder title="Pumps Management" />} />
        <Route path="water-supply" element={<Placeholder title="Water Supply Logs" />} />
        <Route path="water-quality" element={<Placeholder title="Water Quality Testing" />} />
        <Route path="complaints" element={<Placeholder title="Complaints Tracking" />} />
        <Route path="maintenance" element={<Placeholder title="Maintenance Scheduling" />} />
        <Route path="payments" element={<Placeholder title="Payment Collection" />} />
        <Route path="analytics" element={<Placeholder title="System Analytics" />} />
        <Route path="reports" element={<Placeholder title="Generated Reports" />} />
        <Route path="notifications" element={<Placeholder title="System Notifications" />} />
        <Route path="audit-logs" element={<Placeholder title="Audit Logs" />} />
      </Route>

      {/* Operator Routes Placeholder */}
      <Route path="/operator" element={<DashboardLayout role="OPERATOR" />}>
        <Route index element={<Placeholder title="Operator Dashboard" />} />
      </Route>

      {/* Villager Routes Placeholder */}
      <Route path="/villager" element={<DashboardLayout role="VILLAGER" />}>
        <Route index element={<Placeholder title="Villager Dashboard" />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<div className="p-8 text-center text-red-500 text-xl">Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
