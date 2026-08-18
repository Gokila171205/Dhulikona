import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

// Login
import Login from '../pages/auth/Login';

// Operator Pages
import OperatorDashboard from '../pages/Operator/Dashboard';
import OperatorPumps from '../pages/Operator/Pumps';
import OperatorWaterSupply from '../pages/Operator/WaterSupply';
import OperatorWaterQuality from '../pages/Operator/WaterQuality';
import Complaints from '../pages/Operator/Complaints';
import Maintenance from '../pages/Operator/Maintenance';
import Charges from '../pages/Operator/Charges';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';

// Villager Pages
import VillagerDashboard from '../pages/villager/VillagerDashboard';
import VillagerWaterSupply from '../pages/villager/WaterSupply';
import ReportProblem from '../pages/villager/ReportProblem';
import MyComplaints from '../pages/villager/MyComplaints';
import ComplaintDetails from '../pages/villager/ComplaintDetails';
import VillagerWaterQuality from '../pages/villager/WaterQuality';
import PaymentStatus from '../pages/villager/PaymentStatus';
import Notifications from '../pages/villager/Notifications';

// Placeholder
const Placeholder = ({ title }) => (
  <div className="flex h-full min-h-[400px] items-center justify-center">
    <h2 className="text-2xl font-semibold text-gray-500">
      {title} - Coming Soon
    </h2>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= DEFAULT ROUTE ================= */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* ================= LOGIN ================= */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin"
        element={<DashboardLayout role="ADMIN" />}
      >
        <Route
          index
          element={<AdminDashboard />}
        />

        <Route
          path="villages"
          element={<Placeholder title="Villages Management" />}
        />

        <Route
          path="users"
          element={<Placeholder title="Users Management" />}
        />

        <Route
          path="pumps"
          element={<Placeholder title="Pumps Management" />}
        />

        <Route
          path="water-supply"
          element={<Placeholder title="Water Supply Logs" />}
        />

        <Route
          path="water-quality"
          element={<Placeholder title="Water Quality Testing" />}
        />

        <Route
          path="complaints"
          element={<Placeholder title="Complaints Tracking" />}
        />

        <Route
          path="maintenance"
          element={<Placeholder title="Maintenance Scheduling" />}
        />

        <Route
          path="payments"
          element={<Placeholder title="Payment Collection" />}
        />

        <Route
          path="analytics"
          element={<Placeholder title="System Analytics" />}
        />

        <Route
          path="reports"
          element={<Placeholder title="Generated Reports" />}
        />

        <Route
          path="notifications"
          element={<Placeholder title="System Notifications" />}
        />

        <Route
          path="audit-logs"
          element={<Placeholder title="Audit Logs" />}
        />
      </Route>

      {/* ================= OPERATOR ROUTES ================= */}
      <Route
        path="/operator"
        element={<DashboardLayout role="OPERATOR" />}
      >
        <Route
          index
          element={<OperatorDashboard />}
        />

        <Route
          path="pumps"
          element={<OperatorPumps />}
        />

        <Route
          path="water-supply"
          element={<OperatorWaterSupply />}
        />

        <Route
          path="water-quality"
          element={<OperatorWaterQuality />}
        />

        <Route
          path="complaints"
          element={<Complaints />}
        />

        <Route
          path="maintenance"
          element={<Maintenance />}
        />

        <Route
          path="charges"
          element={<Charges />}
        />
      </Route>

      {/* ================= VILLAGER ROUTES ================= */}
      <Route
        path="/villager"
        element={<DashboardLayout role="VILLAGER" />}
      >
        {/* Dashboard */}
        <Route
          index
          element={<VillagerDashboard />}
        />

        {/* Water Supply */}
        <Route
          path="water-supply"
          element={<VillagerWaterSupply />}
        />

        {/* Report Problem */}
        <Route
          path="report-problem"
          element={<ReportProblem />}
        />

        {/* My Complaints */}
        <Route
          path="complaints"
          element={<MyComplaints />}
        />

        {/* Complaint Details */}
        <Route
          path="complaints/:id"
          element={<ComplaintDetails />}
        />

        {/* Water Quality */}
        <Route
          path="water-quality"
          element={<VillagerWaterQuality />}
        />

        {/* Payment Status */}
        <Route
          path="payments"
          element={<PaymentStatus />}
        />

        {/* Notifications */}
        <Route
          path="notifications"
          element={<Notifications />}
        />
      </Route>

      {/* ================= 404 ================= */}
      <Route
        path="*"
        element={
          <div className="p-8 text-center text-red-500 text-xl">
            Page Not Found
          </div>
        }
      />

    </Routes>
  );
};

export default AppRoutes;