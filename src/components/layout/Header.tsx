import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth-store';
import { Bell, Search, Menu, X } from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  showMobileMenuButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onMobileMenuToggle, 
  showMobileMenuButton = true 
}) => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {showMobileMenuButton && (
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={onMobileMenuToggle}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      )}

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1">
          <label htmlFor="search-field" className="sr-only">
            Search patients, encounters, diagnoses
          </label>
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search patients, encounters, diagnoses..."
            type="search"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

          {/* Profile info */}
          <div className="flex items-center gap-x-4">
            <div className="hidden lg:block">
              <div className="text-sm font-semibold leading-6 text-gray-900">
                {user.name}
              </div>
              <div className="text-xs text-gray-500">
                {user.role === 'doctor' && user.specialization}
                {user.role === 'admin' && 'Hospital Administrator'}
                {user.role === 'government' && 'Government Official'}
              </div>
            </div>
            
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user.name.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};