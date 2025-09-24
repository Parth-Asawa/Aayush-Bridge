import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Loader2, Plus } from 'lucide-react';
import { terminologyAPI, DiseaseSearchResult } from '../../lib/terminology-api';
import { supabase, Patient } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth-store';

interface AddDiseaseModalProps {
  patient: Patient;
  onClose: () => void;
  onDiseaseAdded: () => void;
}

export const AddDiseaseModal: React.FC<AddDiseaseModalProps> = ({
  patient,
  onClose,
  onDiseaseAdded
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<DiseaseSearchResult[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    severity: 'moderate' as 'mild' | 'moderate' | 'severe' | 'critical',
    treatment_approach: 'allopathic' as string,
    notes: ''
  });

  const { user } = useAuthStore();

  // Debounced search effect
  useEffect(() => {
    const searchDiseases = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const results = await terminologyAPI.searchDiseases(searchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching diseases:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchDiseases, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const availableTreatmentApproaches = useMemo(() => {
    if (!selectedDisease) return ['allopathic'];
    return selectedDisease.treatment_approach || ['allopathic'];
  }, [selectedDisease]);

  const handleDiseaseSelect = (disease: DiseaseSearchResult) => {
    setSelectedDisease(disease);
    setFormData(prev => ({
      ...prev,
      treatment_approach: disease.treatment_approach?.[0] || 'allopathic'
    }));
  };

  const handleSubmit = async () => {
    if (!selectedDisease || !user) return;

    setSaving(true);
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('problem_list')
        .insert({
          patient_id: patient.id,
          doctor_id: user.id,
          hospital_id: user.hospital_id,
          namaste_code: selectedDisease.namaste_code,
          namaste_name: selectedDisease.namaste_name,
          icd_code: selectedDisease.icd_code,
          icd_name: selectedDisease.icd_name,
          disease_name_hindi: selectedDisease.disease_name_hindi,
          severity: formData.severity,
          treatment_approach: formData.treatment_approach,
          notes: formData.notes
        });

      if (error) throw error;

      // Send to external API
      try {
        await terminologyAPI.saveDiagnosis({
          patient_id: patient.id,
          doctor_id: user.id,
          hospital_id: user.hospital_id || '',
          namaste_code: selectedDisease.namaste_code,
          namaste_name: selectedDisease.namaste_name,
          icd_code: selectedDisease.icd_code,
          icd_name: selectedDisease.icd_name,
          disease_name_hindi: selectedDisease.disease_name_hindi,
          severity: formData.severity,
          treatment_approach: formData.treatment_approach,
          notes: formData.notes
        });
      } catch (apiError) {
        console.warn('External API call failed:', apiError);
        // Continue even if external API fails
      }

      onDiseaseAdded();
    } catch (error) {
      console.error('Error saving diagnosis:', error);
      alert('Failed to save diagnosis. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Add Disease for {patient.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Disease (NAMASTE & ICD-11)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Type disease name in English or Hindi..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                <span className="ml-2 text-gray-600">Searching diseases...</span>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {searchResults.map((disease) => (
                <div
                  key={disease.id}
                  className={`p-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedDisease?.id === disease.id ? 'bg-indigo-50 border-indigo-200' : ''
                  }`}
                  onClick={() => handleDiseaseSelect(disease)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{disease.namaste_name}</h4>
                      <p className="text-sm text-gray-600">{disease.icd_name}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>NAMASTE: {disease.namaste_code}</span>
                        <span>ICD: {disease.icd_code}</span>
                      </div>
                      {disease.disease_name_hindi && (
                        <p className="text-sm text-indigo-600 mt-1">{disease.disease_name_hindi}</p>
                      )}
                      {disease.description && (
                        <p className="text-xs text-gray-500 mt-1">{disease.description}</p>
                      )}
                    </div>
                    {selectedDisease?.id === disease.id && (
                      <div className="ml-3">
                        <div className="h-5 w-5 bg-indigo-600 rounded-full flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Disease Details Form */}
          {selectedDisease && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">Selected Disease Details</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treatment Approach
                  </label>
                  <select
                    value={formData.treatment_approach}
                    onChange={(e) => setFormData(prev => ({ ...prev, treatment_approach: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {availableTreatmentApproaches.map(approach => (
                      <option key={approach} value={approach} className="capitalize">
                        {approach}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clinical Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Add any additional notes about the diagnosis or treatment plan..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedDisease || saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Disease
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};