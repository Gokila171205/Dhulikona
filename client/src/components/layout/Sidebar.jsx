import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Wrench, 
  Droplet, 
  Activity, 
  FileWarning, 
  Settings, 
  CreditCard,
  PieChart,
  FileText,
  Bell,
  ShieldCheck
} from 'lucide-react';

const Sidebar = ({ isOpen, role = 'ADMIN' }) => {
  // Navigation mapping based on role
  const navigation = {
    ADMIN: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Villages', path: '/admin/villages', icon: MapPin },
      { name: 'Users', path: '/admin/users', icon: Users },
      { name: 'Pumps', path: '/admin/pumps', icon: Wrench },
      { name: 'Water Supply', path: '/admin/water-supply', icon: Droplet },
      { name: 'Water Quality', path: '/admin/water-quality', icon: Activity },
      { name: 'Complaints', path: '/admin/complaints', icon: FileWarning },
      { name: 'Maintenance', path: '/admin/maintenance', icon: Settings },
      { name: 'Payments', path: '/admin/payments', icon: CreditCard },
      { name: 'Analytics', path: '/admin/analytics', icon: PieChart },
      { name: 'Reports', path: '/admin/reports', icon: FileText },
      { name: 'Notifications', path: '/admin/notifications', icon: Bell },
      { name: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldCheck },
    ],
    // Placeholders for other roles
   OPERATOR: [
  { name: 'Dashboard', path: '/operator', icon: LayoutDashboard },
  { name: 'Pumps', path: '/operator/pumps', icon: Wrench },
  { name: 'Water Supply', path: '/operator/water-supply', icon: Droplet },
  { name: 'Water Quality', path: '/operator/water-quality', icon: Activity },
  { name: 'Complaints', path: '/operator/complaints', icon: FileWarning },
  { name: 'Maintenance', path: '/operator/maintenance', icon: Settings },
  { name: 'Charges', path: '/operator/charges', icon: CreditCard },
],
    VILLAGER: [
  { name: 'Dashboard', path: '/villager', icon: LayoutDashboard },
  { name: 'Water Supply', path: '/villager/water-supply', icon: Droplet },
  { name: 'Report Problem', path: '/villager/report-problem', icon: FileWarning },
  { name: 'My Complaints', path: '/villager/complaints', icon: FileText },
  { name: 'Water Quality', path: '/villager/water-quality', icon: Activity },
  { name: 'Payment Status', path: '/villager/payments', icon: CreditCard },
  { name: 'Notifications', path: '/villager/notifications', icon: Bell },
]
  };

  const links = navigation[role] || [];

  return (
    <aside className={`bg-white border-r border-gray-200 w-64 flex-shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <nav className="h-full overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === '/admin' || link.path === '/operator' || link.path === '/villager'}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium
              ${isActive 
                ? 'bg-water-blue/10 text-water-blue border-r-4 border-water-blue' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
            }
          >
            <link.icon size={18} />
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
