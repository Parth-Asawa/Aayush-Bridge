import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  Plus, 
  Edit,
  FileText,
  Activity
} from 'lucide-react';
import { supabase, Patient, ProblemListEntry, Encounter } from '../../lib/supabase';
import { AddDiseaseModal } from './AddDiseaseModal';
import { format } from 'date-fns';

export const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [problemList, setProblemList] = useState<ProblemListEntry[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDiseaseModal, setShowAddDiseaseModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'problems' | 'encounters'>('overview');

  useEffect(() => {
    if (id) {
      loadPatientData();
    }
  }, [id]);

  const loadPatientData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Load patient details
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);

      // Load problem list with doctor information
      const { data: problemsData, error: problemsError } = await supabase
        .from('problem_list')
        .select(`
          *,
          doctor:users(name, specialization)
        `)
        .eq('patient_id', id)
        .order('diagnosis_date', { ascending: false });

      if (problemsError) throw problemsError;
      setProblemList(problemsData || []);

      // Load encounters with doctor information
      const { data: encountersData, error: encountersError } = await supabase
        .from('encounters')
        .select(`
          *,
          doctor:users(name, specialization),
          hospital:hospitals(name)
        `)
        .eq('patient_id', id)
        .order('encounter_date', { ascending: false });

      if (encountersError) throw encountersError;
      setEncounters(encountersData || []);

    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDiseaseAdded = () => {
    setShowAddDiseaseModal(false);
    loadPatientData(); // Refresh data
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Patient not found.</p>
        <button
          onClick={() => navigate('/patients')}
          className="mt-4 text-indigo-600 hover:text-indigo-500"
        >
          ← Back to Patient Search
        </button>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: User },
    { key: 'problems', label: `Problems (${problemList.length})`, icon: AlertTriangle },
    { key: 'encounters', label: `Encounters (${encounters.length})`, icon: FileText }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                <p className="text-gray-600">ABHA: {patient.abha_id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddDiseaseModal(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Disease
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit className="h-5 w-5 mr-2" />
                Edit Patient
              </button>
            </div>
          </div>
        </div>

        {/* Patient Summary */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>
                {patient.age ? `${patient.age} years` : 'Age not recorded'} • 
                <span className="capitalize ml-1">{patient.gender || 'Not specified'}</span>
              </span>
            </div>
            {patient.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{patient.phone}</span>
              </div>
            )}
            {patient.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{patient.email}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{patient.city}, {patient.state}</span>
            </div>
          </div>
          
          {patient.blood_group && (
            <div className="mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Blood Group: {patient.blood_group}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Phone:</strong> {patient.phone || 'Not provided'}</p>
                    <p><strong>Alternate Phone:</strong> {patient.alternate_phone || 'Not provided'}</p>
                    <p><strong>Email:</strong> {patient.email || 'Not provided'}</p>
                    <p><strong>Address:</strong> {patient.address || 'Not provided'}</p>
                    <p><strong>PIN Code:</strong> {patient.pincode || 'Not provided'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contact</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {patient.emergency_contact_name || 'Not provided'}</p>
                    <p><strong>Phone:</strong> {patient.emergency_contact_phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {(patient.allergies || patient.medical_history) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Medical Information</h3>
                  <div className="space-y-3">
                    {patient.allergies && (
                      <div>
                        <h4 className="font-medium text-red-600">Allergies</h4>
                        <p className="text-sm text-gray-700">{patient.allergies}</p>
                      </div>
                    )}
                    {patient.medical_history && (
                      <div>
                        <h4 className="font-medium text-gray-900">Medical History</h4>
                        <p className="text-sm text-gray-700">{patient.medical_history}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'problems' && (
            <div>
              {problemList.length > 0 ? (
                <div className="space-y-4">
                  {problemList.map((problem) => (
                    <div key={problem.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {problem.namaste_name || problem.icd_name}
                            </h4>
                            <span className={`
                              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${problem.status === 'active' ? 'bg-green-100 text-green-800' : 
                                problem.status === 'resolved' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'}
                            `}>
                              {problem.status}
                            </span>
                            {problem.severity && (
                              <span className={`
                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${problem.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                  problem.severity === 'severe' ? 'bg-orange-100 text-orange-800' :
                                  problem.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'}
                              `}>
                                {problem.severity}
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><strong>NAMASTE Code:</strong> {problem.namaste_code}</p>
                              <p><strong>ICD Code:</strong> {problem.icd_code}</p>
                            </div>
                            <div>
                              <p><strong>Diagnosed:</strong> {format(new Date(problem.diagnosis_date), 'MMM dd, yyyy')}</p>
                              <p><strong>Doctor:</strong> {problem.doctor?.name}</p>
                            </div>
                          </div>
                          
                          {problem.disease_name_hindi && (
                            <p className="text-sm text-gray-600 mt-2">
                              <strong>Hindi:</strong> {problem.disease_name_hindi}
                            </p>
                          )}
                          
                          {problem.notes && (
                            <p className="text-sm text-gray-700 mt-2">
                              <strong>Notes:</strong> {problem.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No diagnoses recorded for this patient.</p>
                  <button
                    onClick={() => setShowAddDiseaseModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add First Diagnosis
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'encounters' && (
            <div>
              {encounters.length > 0 ? (
                <div className="space-y-4">
                  {encounters.map((encounter) => (
                    <div key={encounter.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 capitalize">
                            {encounter.encounter_type} Visit
                          </h4>
                          <p className="text-sm text-gray-600">
                            {format(new Date(encounter.encounter_date), 'MMMM dd, yyyy')} • 
                            Dr. {encounter.doctor?.name}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {encounter.encounter_type}
                        </span>
                      </div>

                      {encounter.chief_complaint && (
                        <div className="mb-3">
                          <h5 className="font-medium text-gray-900 mb-1">Chief Complaint</h5>
                          <p className="text-sm text-gray-700">{encounter.chief_complaint}</p>
                        </div>
                      )}

                      {encounter.assessment_and_plan && (
                        <div className="mb-3">
                          <h5 className="font-medium text-gray-900 mb-1">Assessment & Plan</h5>
                          <p className="text-sm text-gray-700">{encounter.assessment_and_plan}</p>
                        </div>
                      )}

                      {encounter.vital_signs && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Vital Signs</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                            {Object.entries(encounter.vital_signs).map(([key, value]) => (
                              <div key={key} className="bg-gray-50 px-2 py-1 rounded">
                                <strong className="capitalize">{key.replace('_', ' ')}:</strong> {value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No encounters recorded for this patient.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Disease Modal */}
      {showAddDiseaseModal && (
        <AddDiseaseModal
          patient={patient}
          onClose={() => setShowAddDiseaseModal(false)}
          onDiseaseAdded={handleDiseaseAdded}
        />
      )}
    </div>
  );
};