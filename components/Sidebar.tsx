import React from 'react';
import { LayoutDashboard, Car, Users, UserCheck, FileText, Printer, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cars', label: 'Manage Cars', icon: Car },
    { id: 'clients', label: 'Manage Clients', icon: Users },
    { id: 'agents', label: 'Manage Agents', icon: UserCheck },
    { id: 'contracts', label: 'Manage Contracts', icon: FileText },
    { id: 'new-contract', label: 'New Contract', icon: FileText, highlight: true },
  ];

  return (
    <aside className="w-64 bg-majorelle text-white flex flex-col h-screen fixed left-0 top-0 shadow-2xl z-50 no-print">
      <div className="p-6 border-b border-blue-800 bg-blue-900/50">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          FastCar <span className="text-ocre">El Bahja</span>
        </h1>
        <p className="text-xs text-blue-200 mt-1 uppercase tracking-widest">Central Management</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2 text-xs font-semibold text-blue-300 uppercase">Main Menu</div>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onChangeView(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200
                    ${isActive 
                      ? 'bg-ocre text-white border-r-4 border-white' 
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="px-4 mt-8 mb-2 text-xs font-semibold text-blue-300 uppercase">System</div>
        <ul className="space-y-1">
          <li>
            <button className="w-full flex items-center px-6 py-3 text-sm font-medium text-blue-100 hover:bg-blue-800 transition-colors">
              <Printer className="w-5 h-5 mr-3" />
              Print Invoice
            </button>
          </li>
          <li>
            <button className="w-full flex items-center px-6 py-3 text-sm font-medium text-blue-100 hover:bg-blue-800 transition-colors">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </button>
          </li>
          <li>
            <button className="w-full flex items-center px-6 py-3 text-sm font-medium text-red-300 hover:bg-red-900/30 transition-colors mt-4">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 bg-blue-950 text-xs text-center text-blue-400">
        © 2024 FastCar El Bahja
      </div>
    </aside>
  );
};

export default Sidebar;