import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Login from '../pages/auth/Login';

// ================= OPERATOR PAGES =================
import OperatorDashboard from '../pages/Operator/Dashboard';
import OperatorPumps from '../pages/Operator/Pumps';
import OperatorWaterSupply from '../pages/Operator/WaterSupply';
import OperatorWaterQuality from '../pages/Operator/WaterQuality';
import Complaints from '../pages/Operator/Complaints';
import Maintenance from '../pages/Operator/Maintenance';
import Charges from '../pages/Operator/Charges';

// ================= ADMIN PAGES =================
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

// ================= VILLAGER PAGES =================
import VillagerDashboard from '../pages/villager/VillagerDashboard';
import VillagerWaterSupply from '../pages/villager/WaterSupply';
import ReportProblem from '../pages/villager/ReportProblem';
import MyComplaints from '../pages/villager/MyComplaints';
import ComplaintDetails from '../pages/villager/ComplaintDetails';
import VillagerWaterQuality from '../pages/villager/WaterQuality';
import PaymentStatus from '../pages/villager/PaymentStatus';
import Notifications from '../pages/villager/Notifications';

// ================= PLACEHOLDER =================
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
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route
          path="/admin"
          element={<DashboardLayout role="ADMIN" />}
        >
          <Route index element={<AdminDashboard />} />

          <Route
            path="villages"
            element={<AdminVillages />}
          />

          <Route
            path="users"
            element={<AdminUsers />}
          />

          <Route
            path="pumps"
            element={<AdminPumps />}
          />

          <Route
            path="water-supply"
            element={<AdminWaterSupply />}
          />

          <Route
            path="water-quality"
            element={<AdminWaterQuality />}
          />

          <Route
            path="complaints"
            element={<AdminComplaints />}
          />

          <Route
            path="maintenance"
            element={<AdminMaintenance />}
          />

          <Route
            path="payments"
            element={<AdminPayments />}
          />

          <Route
            path="analytics"
            element={<AdminAnalytics />}
          />

          <Route
            path="reports"
            element={<AdminReports />}
          />

          <Route
            path="notifications"
            element={<AdminNotifications />}
          />

          <Route
            path="audit-logs"
            element={<AdminAuditLogs />}
          />
        </Route>
      </Route>

      {/* ================= OPERATOR ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={['OPERATOR']} />}>
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
      </Route>

      {/* ================= VILLAGER ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={['VILLAGER']} />}>
        <Route
          path="/villager"
          element={<DashboardLayout role="VILLAGER" />}
        >
          <Route
            index
            element={<VillagerDashboard />}
          />

          <Route
            path="water-supply"
            element={<VillagerWaterSupply />}
          />

          <Route
            path="report-problem"
            element={<ReportProblem />}
          />

          <Route
            path="complaints"
            element={<MyComplaints />}
          />

          <Route
            path="complaints/:id"
            element={<ComplaintDetails />}
          />

          <Route
            path="water-quality"
            element={<VillagerWaterQuality />}
          />

          <Route
            path="payments"
            element={<PaymentStatus />}
          />

          <Route
            path="notifications"
            element={<Notifications />}
          />
        </Route>
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