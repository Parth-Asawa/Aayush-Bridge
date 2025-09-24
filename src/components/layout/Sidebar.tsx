import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import { Users, UserCheck, BarChart3, Settings, LogOut, Guitar as Hospital, FileText, TrendingUp, Map, Activity } from 'lucide-react';

const navigation = {
  doctor: [
    { name: 'Dashboard', href: '/dashboard', icon: Activity },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'My Encounters', href: '/encounters', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 }
  ],
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: Activity },
    { name: 'Hospital Overview', href: '/hospital-overview', icon: Hospital },
    { name: 'Patient Management', href: '/patients', icon: Users },
    { name: 'Staff Management', href: '/staff', icon: UserCheck },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/reports', icon: FileText }
  ],
  government: [
    { name: 'Dashboard', href: '/dashboard', icon: Activity },
    { name: 'Morbidity Analytics', href: '/morbidity-analytics', icon: TrendingUp },
    { name: 'Regional Data', href: '/regional-data', icon: Map },
    { name: 'Disease Surveillance', href: '/disease-surveillance', icon: BarChart3 },
    { name: 'Reports & Exports', href: '/reports', icon: FileText }
  ]
};

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const userNavigation = navigation[user.role] || [];

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <div className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center">
            <Hospital className="h-5 w-5 text-white" />
          </div>
          <span className="ml-2 text-xl font-semibold text-gray-900">EMR System</span>
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {userNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => navigate(item.href)}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left
                          ${isActive
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                          }`}
                        />
                        {item.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>

            <li className="mt-auto">
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600" />
                  Sign out
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};