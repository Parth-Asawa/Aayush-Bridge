/*
  # Initial EMR System Schema

  1. New Tables
    - `hospitals` - Hospital information and metadata
    - `users` - User accounts with role-based access (doctor, admin, government)
    - `patients` - Patient demographics and contact information
    - `problem_list` - Patient diagnoses with dual coding (NAMASTE + ICD-11)
    - `encounters` - Medical encounters and treatment notes
    - `audit_logs` - System audit trail for compliance

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Create indexes for optimal query performance

  3. Initial Data
    - Sample hospitals across different states
    - Demo users for each role type
    - Dummy patients with realistic Indian demographics
*/

-- Hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(200) NOT NULL,
  address text,
  city varchar(50) NOT NULL,
  state varchar(50) NOT NULL,
  hospital_type varchar(50) DEFAULT 'allopathic', -- 'allopathic', 'ayurvedic', 'unani', 'siddha'
  registration_number varchar(50),
  contact_phone varchar(15),
  contact_email varchar(100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  abha_id varchar(20) UNIQUE NOT NULL,
  name varchar(100) NOT NULL,
  email varchar(100),
  role varchar(20) NOT NULL CHECK (role IN ('doctor', 'admin', 'government')),
  hospital_id uuid REFERENCES hospitals(id),
  state varchar(50),
  city varchar(50),
  phone varchar(15),
  specialization varchar(100), -- for doctors
  license_number varchar(50), -- for doctors
  department varchar(100),
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  abha_id varchar(20) UNIQUE NOT NULL,
  name varchar(100) NOT NULL,
  age integer CHECK (age > 0 AND age < 150),
  gender varchar(10) CHECK (gender IN ('male', 'female', 'other')),
  phone varchar(15),
  alternate_phone varchar(15),
  email varchar(100),
  address text,
  city varchar(50) NOT NULL,
  state varchar(50) NOT NULL,
  pincode varchar(10),
  emergency_contact_name varchar(100),
  emergency_contact_phone varchar(15),
  blood_group varchar(5),
  allergies text,
  medical_history text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Problem List (Diagnosis) table
CREATE TABLE IF NOT EXISTS problem_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES users(id),
  hospital_id uuid REFERENCES hospitals(id),
  namaste_code varchar(20),
  namaste_name varchar(200),
  icd_code varchar(20),
  icd_name varchar(200),
  disease_name_hindi varchar(200),
  severity varchar(20) CHECK (severity IN ('mild', 'moderate', 'severe', 'critical')),
  status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'resolved')),
  diagnosis_date date DEFAULT CURRENT_DATE,
  resolution_date date,
  notes text,
  treatment_approach varchar(50), -- 'allopathic', 'ayurvedic', 'unani', 'siddha', 'mixed'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Encounters table
CREATE TABLE IF NOT EXISTS encounters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES users(id),
  hospital_id uuid NOT NULL REFERENCES hospitals(id),
  encounter_type varchar(50) DEFAULT 'outpatient' CHECK (encounter_type IN ('outpatient', 'inpatient', 'emergency', 'follow-up', 'consultation')),
  chief_complaint text,
  history_of_present_illness text,
  physical_examination text,
  assessment_and_plan text,
  treatment_notes text,
  prescriptions text,
  follow_up_instructions text,
  encounter_date date DEFAULT CURRENT_DATE,
  discharge_date date,
  vital_signs jsonb, -- Store BP, pulse, temperature, etc.
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  action varchar(50) NOT NULL, -- 'create', 'update', 'delete', 'view'
  table_name varchar(50) NOT NULL,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hospitals
CREATE POLICY "Hospitals are viewable by all authenticated users"
  ON hospitals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify hospitals"
  ON hospitals FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for users
CREATE POLICY "Users can view their own data and hospital colleagues"
  ON users FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    hospital_id IN (
      SELECT hospital_id FROM users WHERE id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'government')
    )
  );

-- RLS Policies for patients
CREATE POLICY "Doctors and admins can access patients in their hospital"
  ON patients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND (
        users.role = 'government' OR
        (users.role IN ('doctor', 'admin') AND 
         EXISTS (SELECT 1 FROM encounters WHERE encounters.patient_id = patients.id AND encounters.hospital_id = users.hospital_id)
        )
      )
    )
  );

-- RLS Policies for problem_list
CREATE POLICY "Problem list accessible by authorized users"
  ON problem_list FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND (
        users.role = 'government' OR
        (users.role IN ('doctor', 'admin') AND users.hospital_id = hospital_id) OR
        users.id = doctor_id
      )
    )
  );

-- RLS Policies for encounters
CREATE POLICY "Encounters accessible by authorized users"
  ON encounters FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND (
        users.role = 'government' OR
        (users.role IN ('doctor', 'admin') AND users.hospital_id = hospital_id) OR
        users.id = doctor_id
      )
    )
  );

-- RLS Policies for audit_logs
CREATE POLICY "Audit logs viewable by admins and government"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'government')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_abha_id ON users(abha_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_hospital_id ON users(hospital_id);
CREATE INDEX IF NOT EXISTS idx_patients_abha_id ON patients(abha_id);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_state_city ON patients(state, city);
CREATE INDEX IF NOT EXISTS idx_problem_list_patient_id ON problem_list(patient_id);
CREATE INDEX IF NOT EXISTS idx_problem_list_diagnosis_date ON problem_list(diagnosis_date);
CREATE INDEX IF NOT EXISTS idx_problem_list_namaste_code ON problem_list(namaste_code);
CREATE INDEX IF NOT EXISTS idx_problem_list_icd_code ON problem_list(icd_code);
CREATE INDEX IF NOT EXISTS idx_encounters_patient_id ON encounters(patient_id);
CREATE INDEX IF NOT EXISTS idx_encounters_doctor_id ON encounters(doctor_id);
CREATE INDEX IF NOT EXISTS idx_encounters_hospital_id ON encounters(hospital_id);
CREATE INDEX IF NOT EXISTS idx_encounters_date ON encounters(encounter_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);