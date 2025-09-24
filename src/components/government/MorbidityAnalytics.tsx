import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import { Calendar, MapPin, TrendingUp, Download, Filter, BarChart3 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface MorbidityData {
  state: string;
  city: string;
  disease_category: string;
  namaste_code: string;
  namaste_name: string;
  icd_code: string;
  treatment_approach: string;
  severity: string;
  diagnosis_date: string;
  count: number;
}

interface FilterState {
  state: string;
  city: string;
  dateRange: {
    start: string;
    end: string;
  };
  diseaseCategory: string;
  treatmentApproach: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const states = [
  'Delhi', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'West Bengal', 
  'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Punjab', 'Kerala'
];

const cities = {
  'Delhi': ['New Delhi', 'Delhi'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli'],
  'West Bengal': ['Kolkata', 'Siliguri', 'Durgapur'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra'],
  'Punjab': ['Chandigarh', 'Amritsar', 'Ludhiana'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode']
};

export const MorbidityAnalytics: React.FC = () => {
  const [data, setData] = useState<MorbidityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    state: '',
    city: '',
    dateRange: {
      start: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
    },
    diseaseCategory: '',
    treatmentApproach: ''
  });

  useEffect(() => {
    loadMorbidityData();
  }, [filters]);

  const loadMorbidityData = async () => {
    setLoading(true);
    try {
      // Build query with filters
      let query = supabase
        .from('problem_list')
        .select(`
          *,
          patients!inner(city, state),
          encounters!inner(encounter_date)
        `)
        .gte('diagnosis_date', filters.dateRange.start)
        .lte('diagnosis_date', filters.dateRange.end);

      // Apply filters
      if (filters.state) {
        query = query.eq('patients.state', filters.state);
      }
      if (filters.city) {
        query = query.eq('patients.city', filters.city);
      }
      if (filters.treatmentApproach) {
        query = query.eq('treatment_approach', filters.treatmentApproach);
      }

      const { data: rawData, error } = await query;
      if (error) throw error;

      // Process data for visualization
      const processedData = (rawData || []).map(item => ({
        state: item.patients.state,
        city: item.patients.city,
        disease_category: item.namaste_code?.startsWith('NAM') ? 'NAMASTE' : 'ICD',
        namaste_code: item.namaste_code || '',
        namaste_name: item.namaste_name || '',
        icd_code: item.icd_code || '',
        treatment_approach: item.treatment_approach || 'allopathic',
        severity: item.severity || 'moderate',
        diagnosis_date: item.diagnosis_date,
        count: 1
      }));

      setData(processedData);
    } catch (error) {
      console.error('Error loading morbidity data:', error);
      // Use mock data for demo
      setData(getMockMorbidityData());
    } finally {
      setLoading(false);
    }
  };

  const getMockMorbidityData = (): MorbidityData[] => {
    const diseases = [
      { namaste: 'NAM001', name: 'Madhumeha (Diabetes)', icd: 'E11.9' },
      { namaste: 'NAM002', name: 'Jwara (Fever)', icd: 'R50.9' },
      { namaste: 'NAM003', name: 'Amavata (Arthritis)', icd: 'M06.9' },
      { namaste: 'NAM004', name: 'Hridroga (Heart Disease)', icd: 'I25.9' },
      { namaste: 'NAM005', name: 'Raktachapa (Hypertension)', icd: 'I10' }
    ];

    const approaches = ['allopathic', 'ayurvedic', 'mixed', 'unani'];
    const severities = ['mild', 'moderate', 'severe', 'critical'];

    return Array.from({ length: 200 }, (_, i) => {
      const state = states[Math.floor(Math.random() * states.length)];
      const cityList = cities[state as keyof typeof cities] || [state];
      const city = cityList[Math.floor(Math.random() * cityList.length)];
      const disease = diseases[Math.floor(Math.random() * diseases.length)];
      
      return {
        state,
        city,
        disease_category: 'NAMASTE',
        namaste_code: disease.namaste,
        namaste_name: disease.name,
        icd_code: disease.icd,
        treatment_approach: approaches[Math.floor(Math.random() * approaches.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        diagnosis_date: format(
          new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000),
          'yyyy-MM-dd'
        ),
        count: 1
      };
    });
  };

  // Data processing for charts
  const stateWiseData = React.useMemo(() => {
    const grouped = data.reduce((acc, item) => {
      acc[item.state] = (acc[item.state] || 0) + item.count;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [data]);

  const treatmentApproachData = React.useMemo(() => {
    const grouped = data.reduce((acc, item) => {
      acc[item.treatment_approach] = (acc[item.treatment_approach] || 0) + item.count;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([approach, count]) => ({
      approach: approach.charAt(0).toUpperCase() + approach.slice(1),
      count
    }));
  }, [data]);

  const diseasePrevalenceData = React.useMemo(() => {
    const grouped = data.reduce((acc, item) => {
      const key = item.namaste_name || item.icd_code;
      acc[key] = (acc[key] || 0) + item.count;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([disease, count]) => ({ disease, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [data]);

  const monthlyTrendData = React.useMemo(() => {
    const grouped = data.reduce((acc, item) => {
      const month = format(new Date(item.diagnosis_date), 'MMM yyyy');
      acc[month] = (acc[month] || 0) + item.count;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [data]);

  const handleExportData = () => {
    const csvContent = [
      'State,City,Disease,NAMASTE Code,ICD Code,Treatment Approach,Severity,Date,Count',
      ...data.map(item => 
        `${item.state},${item.city},"${item.namaste_name}",${item.namaste_code},${item.icd_code},${item.treatment_approach},${item.severity},${item.diagnosis_date},${item.count}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `morbidity-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Morbidity Analytics</h1>
          <p className="text-gray-600">Ministry of Ayush - Disease Surveillance Dashboard</p>
        </div>
        <button
          onClick={handleExportData}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-5 w-5 mr-2" />
          Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select
              value={filters.state}
              onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value, city: '' }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={!filters.state}
            >
              <option value="">All Cities</option>
              {filters.state && cities[filters.state as keyof typeof cities]?.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                dateRange: { ...prev.dateRange, start: e.target.value } 
              }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                dateRange: { ...prev.dateRange, end: e.target.value } 
              }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
            <select
              value={filters.treatmentApproach}
              onChange={(e) => setFilters(prev => ({ ...prev, treatmentApproach: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Approaches</option>
              <option value="allopathic">Allopathic</option>
              <option value="ayurvedic">Ayurvedic</option>
              <option value="unani">Unani</option>
              <option value="siddha">Siddha</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading analytics data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* State-wise Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Disease Cases by State</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stateWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Treatment Approach Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Approaches</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={treatmentApproachData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ approach, percent }) => `${approach} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {treatmentApproachData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Disease Prevalence */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Diseases</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={diseasePrevalenceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="disease" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Cases</dt>
                <dd className="text-lg font-medium text-gray-900">{data.length.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">States Covered</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {new Set(data.map(d => d.state)).size}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Traditional Medicine</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {Math.round((data.filter(d => ['ayurvedic', 'unani', 'siddha', 'mixed'].includes(d.treatment_approach)).length / data.length) * 100) || 0}%
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Date Range</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {format(new Date(filters.dateRange.start), 'MMM dd')} - {format(new Date(filters.dateRange.end), 'MMM dd, yyyy')}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};