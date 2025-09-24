import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Map, 
  BarChart3, 
  FileText,
  Users,
  Activity,
  AlertTriangle,
  Globe
} from 'lucide-react';
import { useAuthStore } from '../../store/auth-store';
import { format } from 'date-fns';

export const GovernmentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const quickStats = [
    { title: 'States Monitored', value: '28', icon: Map, color: 'bg-blue-500' },
    { title: 'Active Hospitals', value: '1,247', icon: Activity, color: 'bg-green-500' },
    { title: 'Traditional Medicine Cases', value: '34%', icon: TrendingUp, color: 'bg-yellow-500' },
    { title: 'Disease Alerts', value: '3', icon: AlertTriangle, color: 'bg-red-500' }
  ];

  const quickActions = [
    {
      title: 'Morbidity Analytics',
      description: 'State and city-wise disease surveillance data',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => navigate('/morbidity-analytics')
    },
    {
      title: 'Regional Data',
      description: 'Geographic distribution of diseases',
      icon: Map,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => navigate('/regional-data')
    },
    {
      title: 'Disease Surveillance',
      description: 'Real-time disease monitoring and alerts',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => navigate('/disease-surveillance')
    },
    {
      title: 'Reports & Export',
      description: 'Generate comprehensive reports for Ministry',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => navigate('/reports')
    }
  ];

  const recentAlerts = [
    {
      type: 'High',
      message: 'Unusual spike in respiratory diseases in Delhi NCR',
      time: '2 hours ago',
      color: 'text-red-600 bg-red-50'
    },
    {
      type: 'Medium',
      message: 'Diabetes cases increasing in Maharashtra',
      time: '4 hours ago',
      color: 'text-yellow-600 bg-yellow-50'
    },
    {
      type: 'Info',
      message: 'New Ayurvedic treatment center registered in Kerala',
      time: '6 hours ago',
      color: 'text-blue-600 bg-blue-50'
    }
  ];

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
  }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`h-8 w-8 rounded-md ${color} flex items-center justify-center`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Ministry of Ayush Dashboard</h1>
            <p className="text-emerald-100 mt-1">
              Welcome, {user?.name} • Government Health Surveillance
            </p>
            <p className="text-emerald-100 text-sm">
              {format(new Date(), 'EEEE, MMMM do, yyyy')}
            </p>
          </div>
          <div className="hidden md:block">
            <Globe className="h-16 w-16 text-white/20" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={action.action}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 h-12 w-12 rounded-lg ${action.bgColor} flex items-center justify-center`}>
                <action.icon className={`h-6 w-6 ${action.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <h3 className={`text-lg font-semibold ${action.color} group-hover:${action.color.replace('600', '700')}`}>
                  {action.title}
                </h3>
                <p className="text-gray-600 mt-1">{action.description}</p>
              </div>
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Alerts and Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Recent Alerts
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${alert.color}`}>
                    {alert.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-500 font-medium">
              View all alerts →
            </button>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Key Insights
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900">Traditional Medicine Adoption</h4>
                <p className="text-sm text-blue-700 mt-1">
                  34% increase in Ayurvedic treatments compared to last quarter
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900">Regional Performance</h4>
                <p className="text-sm text-green-700 mt-1">
                  Kerala leads in NAMASTE code adoption with 78% coverage
                </p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900">Disease Trends</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Diabetes and hypertension remain top health concerns nationwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAMASTE Integration Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">NAMASTE & ICD-11 Integration Status</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            System Online
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">NAMASTE Codes</span>
              <span className="text-2xl font-bold text-indigo-600">2,847</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Active terminology entries</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">ICD-11 Mapping</span>
              <span className="text-2xl font-bold text-green-600">95%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Dual coding coverage</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">API Uptime</span>
              <span className="text-2xl font-bold text-emerald-600">99.9%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};