import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminVillages from '../pages/admin/Villages';
import AdminPumps from '../pages/admin/Pumps';
import AdminWaterSupply from '../pages/admin/WaterSupply';
import AdminWaterQuality from '../pages/admin/WaterQuality';
import AdminComplaints from '../pages/admin/Complaints';
import AdminMaintenance from '../pages/admin/Maintenance';
import AdminPayments from '../pages/admin/Payments';
import AdminAnalytics from '../pages/admin/Analytics';
import AdminReports from '../pages/admin/Reports';
import AdminNotifications from '../pages/admin/Notifications';
import AdminAuditLogs from '../pages/admin/AuditLogs';

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
        <Route path="villages" element={<AdminVillages />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="pumps" element={<AdminPumps />} />
        <Route path="water-supply" element={<AdminWaterSupply />} />
        <Route path="water-quality" element={<AdminWaterQuality />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="maintenance" element={<AdminMaintenance />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
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
