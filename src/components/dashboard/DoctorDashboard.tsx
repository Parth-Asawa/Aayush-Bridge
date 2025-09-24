import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Clock,
  Plus,
  ChevronRight,
  Activity,
  BarChart3
} from 'lucide-react';
import { supabase, Patient, ProblemListEntry, Encounter } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth-store';
import { format, isToday, isThisWeek } from 'date-fns';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayEncounters: 0,
    activeProblems: 0,
    weeklyEncounters: 0
  });
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [recentEncounters, setRecentEncounters] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get patient statistics
      const { count: totalPatientsCount } = await supabase
        .from('encounters')
        .select('patient_id', { count: 'exact', head: true })
        .eq('doctor_id', user.id);

      // Get today's encounters
      const todayStart = format(new Date(), 'yyyy-MM-dd');
      const { count: todayEncountersCount } = await supabase
        .from('encounters')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user.id)
        .eq('encounter_date', todayStart);

      // Get active problems count
      const { count: activeProblemsCount } = await supabase
        .from('problem_list')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user.id)
        .eq('status', 'active');

      // Get this week's encounters
      const weekStart = format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      const { count: weeklyEncountersCount } = await supabase
        .from('encounters')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user.id)
        .gte('encounter_date', weekStart);

      setStats({
        totalPatients: totalPatientsCount || 0,
        todayEncounters: todayEncountersCount || 0,
        activeProblems: activeProblemsCount || 0,
        weeklyEncounters: weeklyEncountersCount || 0
      });

      // Get recent patients from encounters
      const { data: recentEncountersData } = await supabase
        .from('encounters')
        .select(`
          *,
          patients (
            id, abha_id, name, age, gender, phone, city, state
          )
        `)
        .eq('doctor_id', user.id)
        .order('encounter_date', { ascending: false })
        .limit(5);

      const uniquePatients = recentEncountersData
        ?.map(enc => enc.patients)
        .filter((patient, index, self) => 
          patient && index === self.findIndex(p => p && p.id === patient.id)
        ) || [];

      setRecentPatients(uniquePatients as Patient[]);

      // Get recent encounters
      const { data: encounters } = await supabase
        .from('encounters')
        .select(`
          *,
          patients (name, abha_id)
        `)
        .eq('doctor_id', user.id)
        .order('encounter_date', { ascending: false })
        .limit(5);

      setRecentEncounters(encounters || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    trend?: string;
    onClick?: () => void;
  }> = ({ title, value, icon: Icon, color, trend, onClick }) => (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`h-8 w-8 rounded-md ${color} flex items-center justify-center`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {trend && (
                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  {trend}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
            <p className="text-indigo-100 mt-1">
              {user?.specialization && `${user.specialization} • `}
              {format(new Date(), 'EEEE, MMMM do, yyyy')}
            </p>
          </div>
          <div className="hidden md:block">
            <button
              onClick={() => navigate('/patients')}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Quick Patient Search
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={Users}
          color="bg-blue-500"
          onClick={() => navigate('/patients')}
        />
        <StatCard
          title="Today's Encounters"
          value={stats.todayEncounters}
          icon={Clock}
          color="bg-green-500"
          onClick={() => navigate('/encounters')}
        />
        <StatCard
          title="Active Problems"
          value={stats.activeProblems}
          icon={Activity}
          color="bg-yellow-500"
        />
        <StatCard
          title="This Week"
          value={stats.weeklyEncounters}
          icon={TrendingUp}
          color="bg-purple-500"
          trend="+12%"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/patients')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                Search Patients
              </h3>
              <p className="text-gray-600 mt-1">Find and manage patient records</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
          </div>
        </button>

        <button
          onClick={() => navigate('/encounters')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                My Encounters
              </h3>
              <p className="text-gray-600 mt-1">View recent patient encounters</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
          </div>
        </button>

        <button
          onClick={() => navigate('/analytics')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                Analytics
              </h3>
              <p className="text-gray-600 mt-1">View patient and diagnosis trends</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
              <button
                onClick={() => navigate('/patients')}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                View all
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentPatients.length > 0 ? (
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">
                        {patient.age ? `${patient.age}y` : ''} {patient.gender ? `• ${patient.gender}` : ''} 
                        {patient.city ? ` • ${patient.city}` : ''}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No recent patients</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Encounters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Encounters</h2>
              <button
                onClick={() => navigate('/encounters')}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                View all
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentEncounters.length > 0 ? (
              <div className="space-y-3">
                {recentEncounters.map((encounter) => (
                  <div
                    key={encounter.id}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {encounter.patients?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(encounter.encounter_date), 'MMM dd, yyyy')} • 
                        <span className="capitalize ml-1">{encounter.encounter_type}</span>
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No recent encounters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};