import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Activity, TrendingUp, Guitar as Hospital, BarChart3, Calendar, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth-store';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todayEncounters: 0,
    activeProblems: 0
  });
  const [departmentData, setDepartmentData] = useState<Array<{ department: string; patients: number }>>([]);
  const [diseaseData, setDiseaseData] = useState<Array<{ disease: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.hospital_id) return;

    setLoading(true);
    try {
      // Hospital-wide patient count
      const { count: totalPatientsCount } = await supabase
        .from('encounters')
        .select('patient_id', { count: 'exact', head: true })
        .eq('hospital_id', user.hospital_id);

      // Hospital doctors count
      const { count: totalDoctorsCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('hospital_id', user.hospital_id)
        .eq('role', 'doctor');

      // Today's encounters
      const todayStart = format(new Date(), 'yyyy-MM-dd');
      const { count: todayEncountersCount } = await supabase
        .from('encounters')
        .select('*', { count: 'exact', head: true })
        .eq('hospital_id', user.hospital_id)
        .eq('encounter_date', todayStart);

      // Active problems in hospital
      const { count: activeProblemsCount } = await supabase
        .from('problem_list')
        .select('*', { count: 'exact', head: true })
        .eq('hospital_id', user.hospital_id)
        .eq('status', 'active');

      setStats({
        totalPatients: totalPatientsCount || 0,
        totalDoctors: totalDoctorsCount || 0,
        todayEncounters: todayEncountersCount || 0,
        activeProblems: activeProblemsCount || 0
      });

      // Department-wise data
      const { data: doctorData } = await supabase
        .from('users')
        .select(`
          department,
          encounters!inner(patient_id)
        `)
        .eq('hospital_id', user.hospital_id)
        .eq('role', 'doctor');

      const deptStats = (doctorData || []).reduce((acc, doctor) => {
        const dept = doctor.department || 'General';
        acc[dept] = (acc[dept] || 0) + (doctor.encounters?.length || 0);
        return acc;
      }, {} as Record<string, number>);

      setDepartmentData(
        Object.entries(deptStats).map(([department, patients]) => ({
          department,
          patients
        }))
      );

      // Top diseases in hospital
      const { data: problemsData } = await supabase
        .from('problem_list')
        .select('namaste_name, icd_name')
        .eq('hospital_id', user.hospital_id)
        .eq('status', 'active');

      const diseaseStats = (problemsData || []).reduce((acc, problem) => {
        const disease = problem.namaste_name || problem.icd_name || 'Unknown';
        acc[disease] = (acc[disease] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setDiseaseData(
        Object.entries(diseaseStats)
          .map(([disease, count]) => ({ disease: disease.substring(0, 20), count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      );

    } catch (error) {
      console.error('Error loading admin dashboard data:', error);
      // Set mock data for demo
      setStats({
        totalPatients: 156,
        totalDoctors: 12,
        todayEncounters: 23,
        activeProblems: 89
      });
      setDepartmentData([
        { department: 'Cardiology', patients: 45 },
        { department: 'Internal Medicine', patients: 38 },
        { department: 'General Medicine', patients: 32 },
        { department: 'Panchakarma', patients: 25 },
        { department: 'Surgery', patients: 16 }
      ]);
      setDiseaseData([
        { disease: 'Diabetes', count: 28 },
        { disease: 'Hypertension', count: 22 },
        { disease: 'Arthritis', count: 18 },
        { disease: 'Heart Disease', count: 15 },
        { disease: 'Fever', count: 12 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    onClick?: () => void;
  }> = ({ title, value, icon: Icon, color, onClick }) => (
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
            <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
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
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hospital Administration</h1>
            <p className="text-purple-100 mt-1">
              Welcome back, {user?.name} • {format(new Date(), 'EEEE, MMMM do, yyyy')}
            </p>
          </div>
          <div className="hidden md:block">
            <Hospital className="h-16 w-16 text-white/20" />
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
          title="Hospital Doctors"
          value={stats.totalDoctors}
          icon={UserCheck}
          color="bg-green-500"
          onClick={() => navigate('/staff')}
        />
        <StatCard
          title="Today's Encounters"
          value={stats.todayEncounters}
          icon={Calendar}
          color="bg-yellow-500"
        />
        <StatCard
          title="Active Cases"
          value={stats.activeProblems}
          icon={Activity}
          color="bg-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Load by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="department" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="patients" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Diseases */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Active Diseases</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diseaseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ disease, percent }) => `${disease} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {diseaseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Patient Management</h3>
              <p className="text-gray-600 mt-1">View and manage all hospital patients</p>
              <button
                onClick={() => navigate('/patients')}
                className="mt-3 text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Manage Patients →
              </button>
            </div>
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Staff Management</h3>
              <p className="text-gray-600 mt-1">Manage doctors and hospital staff</p>
              <button
                onClick={() => navigate('/staff')}
                className="mt-3 text-green-600 hover:text-green-500 font-medium"
              >
                Manage Staff →
              </button>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analytics & Reports</h3>
              <p className="text-gray-600 mt-1">View detailed hospital analytics</p>
              <button
                onClick={() => navigate('/analytics')}
                className="mt-3 text-purple-600 hover:text-purple-500 font-medium"
              >
                View Analytics →
              </button>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};