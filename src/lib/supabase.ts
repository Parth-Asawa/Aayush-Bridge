import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database Types
export interface Hospital {
  id: string;
  name: string;
  address?: string;
  city: string;
  state: string;
  hospital_type: 'allopathic' | 'ayurvedic' | 'unani' | 'siddha';
  registration_number?: string;
  contact_phone?: string;
  contact_email?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  abha_id: string;
  name: string;
  email?: string;
  role: 'doctor' | 'admin' | 'government';
  hospital_id?: string;
  state?: string;
  city?: string;
  phone?: string;
  specialization?: string;
  license_number?: string;
  department?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  hospital?: Hospital;
}

export interface Patient {
  id: string;
  abha_id: string;
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  alternate_phone?: string;
  email?: string;
  address?: string;
  city: string;
  state: string;
  pincode?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  blood_group?: string;
  allergies?: string;
  medical_history?: string;
  created_at: string;
  updated_at: string;
}

export interface ProblemListEntry {
  id: string;
  patient_id: string;
  doctor_id: string;
  hospital_id?: string;
  namaste_code?: string;
  namaste_name?: string;
  icd_code?: string;
  icd_name?: string;
  disease_name_hindi?: string;
  severity?: 'mild' | 'moderate' | 'severe' | 'critical';
  status: 'active' | 'inactive' | 'resolved';
  diagnosis_date: string;
  resolution_date?: string;
  notes?: string;
  treatment_approach?: 'allopathic' | 'ayurvedic' | 'unani' | 'siddha' | 'mixed';
  created_at: string;
  updated_at: string;
  doctor?: User;
  patient?: Patient;
}

export interface Encounter {
  id: string;
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  encounter_type: 'outpatient' | 'inpatient' | 'emergency' | 'follow-up' | 'consultation';
  chief_complaint?: string;
  history_of_present_illness?: string;
  physical_examination?: string;
  assessment_and_plan?: string;
  treatment_notes?: string;
  prescriptions?: string;
  follow_up_instructions?: string;
  encounter_date: string;
  discharge_date?: string;
  vital_signs?: Record<string, string>;
  created_at: string;
  updated_at: string;
  doctor?: User;
  patient?: Patient;
  hospital?: Hospital;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: 'create' | 'update' | 'delete' | 'view';
  table_name: string;
  record_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: User;
}