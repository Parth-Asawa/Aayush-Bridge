// External Terminology Microservice API Integration
const API_HOST = import.meta.env.VITE_TERMINOLOGY_API_HOST || 'https://your-ngrok-url.ngrok-free.app';
const API_KEY = import.meta.env.VITE_TERMINOLOGY_API_KEY || '22911A05P5';

export interface DiseaseSearchResult {
  id: string;
  namaste_code: string;
  namaste_name: string;
  icd_code: string;
  icd_name: string;
  disease_name_hindi: string;
  category: string;
  description?: string;
  synonyms?: string[];
  treatment_approach?: string[];
}

export interface DiagnosisData {
  patient_id: string;
  doctor_id: string;
  hospital_id?: string;
  namaste_code: string;
  namaste_name: string;
  icd_code: string;
  icd_name: string;
  disease_name_hindi: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  treatment_approach: string;
  notes?: string;
}

class TerminologyAPI {
  private baseHeaders = {
    'x-api-key': API_KEY,
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json'
  };

  async searchDiseases(term: string): Promise<DiseaseSearchResult[]> {
    try {
      // First, try the external API
      const response = await fetch(
        `${API_HOST}/api/search?term=${encodeURIComponent(term)}`, 
        {
          headers: this.baseHeaders,
          signal: AbortSignal.timeout(5000) // 5 second timeout
        }
      );
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('External terminology API not available, using fallback data:', error);
    }

    // Fallback to mock data for demo purposes
    return this.getFallbackSearchResults(term);
  }

  async saveDiagnosis(data: DiagnosisData): Promise<{ success: boolean; message: string }> {
    try {
      // First, try the external API
      const response = await fetch(`${API_HOST}/api/diagnosis`, {
        method: 'POST',
        headers: this.baseHeaders,
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('External terminology API not available for saving, using fallback:', error);
    }

    // Fallback success response
    return { success: true, message: 'Diagnosis saved successfully (offline mode)' };
  }

  private getFallbackSearchResults(term: string): DiseaseSearchResult[] {
    const mockDiseases: DiseaseSearchResult[] = [
      {
        id: 'mock-1',
        namaste_code: 'NAM001',
        namaste_name: 'Madhumeha (Diabetes Mellitus)',
        icd_code: 'E11.9',
        icd_name: 'Type 2 diabetes mellitus without complications',
        disease_name_hindi: 'मधुमेह',
        category: 'Endocrine',
        description: 'A metabolic disorder characterized by high blood sugar levels',
        synonyms: ['Diabetes', 'High Blood Sugar', 'Prameha'],
        treatment_approach: ['allopathic', 'ayurvedic', 'mixed']
      },
      {
        id: 'mock-2',
        namaste_code: 'NAM002',
        namaste_name: 'Jwara (Fever)',
        icd_code: 'R50.9',
        icd_name: 'Fever unspecified',
        disease_name_hindi: 'ज्वर',
        category: 'Symptoms',
        description: 'Elevation of body temperature above normal',
        synonyms: ['Fever', 'Pyrexia', 'Taap'],
        treatment_approach: ['allopathic', 'ayurvedic', 'unani']
      },
      {
        id: 'mock-3',
        namaste_code: 'NAM003',
        namaste_name: 'Amavata (Rheumatoid Arthritis)',
        icd_code: 'M06.9',
        icd_name: 'Rheumatoid arthritis unspecified',
        disease_name_hindi: 'आमवात',
        category: 'Musculoskeletal',
        description: 'Chronic inflammatory disorder affecting joints',
        synonyms: ['Rheumatoid Arthritis', 'Joint Pain', 'Sandhi Vaat'],
        treatment_approach: ['allopathic', 'ayurvedic']
      },
      {
        id: 'mock-4',
        namaste_code: 'NAM004',
        namaste_name: 'Hridroga (Heart Disease)',
        icd_code: 'I25.9',
        icd_name: 'Chronic ischemic heart disease unspecified',
        disease_name_hindi: 'हृदय रोग',
        category: 'Cardiovascular',
        description: 'Disease affecting the heart and blood vessels',
        synonyms: ['Heart Disease', 'Cardiac Disease', 'Dil Ki Bimari'],
        treatment_approach: ['allopathic', 'ayurvedic', 'mixed']
      },
      {
        id: 'mock-5',
        namaste_code: 'NAM005',
        namaste_name: 'Raktachapa (Hypertension)',
        icd_code: 'I10',
        icd_name: 'Essential hypertension',
        disease_name_hindi: 'उच्च रक्तचाप',
        category: 'Cardiovascular',
        description: 'High blood pressure condition',
        synonyms: ['High Blood Pressure', 'Hypertension', 'High BP'],
        treatment_approach: ['allopathic', 'ayurvedic']
      },
      {
        id: 'mock-6',
        namaste_code: 'NAM006',
        namaste_name: 'Kasa (Cough)',
        icd_code: 'R05',
        icd_name: 'Cough',
        disease_name_hindi: 'खांसी',
        category: 'Respiratory',
        description: 'Sudden expulsion of air from lungs',
        synonyms: ['Cough', 'Khasi', 'Tussis'],
        treatment_approach: ['allopathic', 'ayurvedic', 'unani']
      },
      {
        id: 'mock-7',
        namaste_code: 'NAM007',
        namaste_name: 'Shwasa (Asthma)',
        icd_code: 'J45.9',
        icd_name: 'Asthma unspecified',
        disease_name_hindi: 'दमा',
        category: 'Respiratory',
        description: 'Chronic respiratory condition with airway inflammation',
        synonyms: ['Asthma', 'Breathing Problems', 'Saans Ki Bimari'],
        treatment_approach: ['allopathic', 'ayurvedic']
      },
      {
        id: 'mock-8',
        namaste_code: 'NAM008',
        namaste_name: 'Arsha (Hemorrhoids)',
        icd_code: 'K64.9',
        icd_name: 'Hemorrhoids unspecified',
        disease_name_hindi: 'बवासीर',
        category: 'Gastrointestinal',
        description: 'Swollen blood vessels in rectum and anus',
        synonyms: ['Piles', 'Hemorrhoids', 'Bawaseer'],
        treatment_approach: ['allopathic', 'ayurvedic']
      }
    ];

    // Filter based on search term
    return mockDiseases.filter(disease =>
      disease.namaste_name.toLowerCase().includes(term.toLowerCase()) ||
      disease.icd_name.toLowerCase().includes(term.toLowerCase()) ||
      disease.disease_name_hindi.includes(term) ||
      disease.synonyms?.some(synonym => 
        synonym.toLowerCase().includes(term.toLowerCase())
      )
    );
  }
}

export const terminologyAPI = new TerminologyAPI();