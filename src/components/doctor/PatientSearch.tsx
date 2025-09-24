import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Phone, MapPin, Calendar, Plus } from 'lucide-react';
import { supabase, Patient } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth-store';

export const PatientSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Load recent patients on mount
  useEffect(() => {
    loadRecentPatients();
  }, []);

  // Search patients when search term changes
  useEffect(() => {
    const searchPatients = async () => {
      if (searchTerm.length < 2) {
        setPatients([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .or(`name.ilike.%${searchTerm}%,abha_id.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
          .limit(10);

        if (error) throw error;
        setPatients(data || []);
      } catch (error) {
        console.error('Error searching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchPatients, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const loadRecentPatients = async () => {
    try {
      // Get recent patients from encounters for this doctor
      const { data, error } = await supabase
        .from('encounters')
        .select(`
          patient_id,
          encounter_date,
          patients (
            id, abha_id, name, age, gender, phone, city, state, created_at
          )
        `)
        .eq('doctor_id', user?.id)
        .order('encounter_date', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      const uniquePatients = data
        ?.map(enc => enc.patients)
        .filter((patient, index, self) => 
          patient && index === self.findIndex(p => p && p.id === patient.id)
        ) || [];

      setRecentPatients(uniquePatients as Patient[]);
    } catch (error) {
      console.error('Error loading recent patients:', error);
    }
  };

  const PatientCard: React.FC<{ patient: Patient; isRecent?: boolean }> = ({ patient, isRecent }) => (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/patients/${patient.id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
              <p className="text-sm text-gray-500">ABHA: {patient.abha_id}</p>
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>
                {patient.age ? `${patient.age} years` : 'Age not recorded'} • 
                <span className="capitalize ml-1">{patient.gender || 'Not specified'}</span>
              </span>
            </div>
            {patient.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{patient.phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 col-span-2">
              <MapPin className="h-4 w-4" />
              <span>{patient.city}, {patient.state}</span>
            </div>
          </div>
        </div>
        
        {isRecent && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Recent
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Search</h1>
            <p className="text-gray-600">Search and manage your patients</p>
          </div>
          <button
            onClick={() => navigate('/patients/new')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Patient
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, ABHA ID, or phone number..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Results</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Searching patients...</p>
            </div>
          ) : patients.length > 0 ? (
            <div className="space-y-4">
              {patients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No patients found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Recent Patients */}
      {recentPatients.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h2>
          <div className="space-y-4">
            {recentPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} isRecent />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!searchTerm && recentPatients.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recent patients</h3>
          <p className="text-gray-600 mb-6">Start by searching for existing patients or adding new ones.</p>
          <button
            onClick={() => navigate('/patients/new')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Patient
          </button>
        </div>
      )}
    </div>
  );
};