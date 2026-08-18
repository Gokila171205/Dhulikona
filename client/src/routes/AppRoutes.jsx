import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

// Operator Pages
import OperatorDashboard from '../pages/Operator/Dashboard';
import OperatorPumps from '../pages/Operator/Pumps';
import WaterSupply from '../pages/Operator/WaterSupply';
import WaterQuality from '../pages/Operator/WaterQuality';
import Complaints from '../pages/Operator/Complaints';
import Maintenance from '../pages/Operator/Maintenance';
import Charges from '../pages/Operator/Charges';
import OperatorLogin from '../pages/Operator/OperatorLogin';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';

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

      {/* Default Route */}
      <Route
        path="/"
        element={<Navigate to="/admin" replace />}
      />

      {/* =========================
          OPERATOR LOGIN
      ========================== */}
      <Route
        path="/operator/login"
        element={<OperatorLogin />}
      />

      {/* =========================
          ADMIN ROUTES
      ========================== */}
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

      {/* =========================
          OPERATOR ROUTES
      ========================== */}
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
          element={<WaterSupply />}
        />

        <Route
          path="water-quality"
          element={<WaterQuality />}
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

      {/* =========================
          VILLAGER ROUTES
      ========================== */}
      <Route
        path="/villager"
        element={<DashboardLayout role="VILLAGER" />}
      >
        <Route
          index
          element={<Placeholder title="Villager Dashboard" />}
        />
      </Route>

      {/* =========================
          404
      ========================== */}
      <Route
        path="*"
        element={
          <div className="p-8 text-center text-xl text-red-500">
            Page Not Found
          </div>
        }
      />

    </Routes>
  );
};

export default AppRoutes;