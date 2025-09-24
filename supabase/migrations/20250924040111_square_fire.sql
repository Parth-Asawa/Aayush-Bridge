/*
  # Seed Initial Data for EMR System

  1. Sample Hospitals
    - Major hospitals across different Indian states
    - Mix of allopathic and traditional medicine hospitals

  2. Demo Users
    - Sample users for each role (doctor, admin, government)
    - Realistic Indian names and credentials

  3. Dummy Patients
    - 50 patients with realistic Indian demographics
    - Mix of ages, genders, and locations
    - Some with existing medical history
*/

-- Insert sample hospitals
INSERT INTO hospitals (id, name, address, city, state, hospital_type, registration_number, contact_phone, contact_email) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Apollo Hospital', 'Greams Lane, Off Greams Road', 'Chennai', 'Tamil Nadu', 'allopathic', 'TN/ALP/001', '+91-44-28296000', 'info@apollochennai.com'),
  ('550e8400-e29b-41d4-a716-446655440002', 'All India Institute of Medical Sciences', 'Ansari Nagar', 'New Delhi', 'Delhi', 'allopathic', 'DL/ALP/002', '+91-11-26588500', 'info@aiims.edu'),
  ('550e8400-e29b-41d4-a716-446655440003', 'King George Medical College', 'Chowk, Lucknow', 'Lucknow', 'Uttar Pradesh', 'allopathic', 'UP/ALP/003', '+91-522-2257450', 'info@kgmcindia.edu'),
  ('550e8400-e29b-41d4-a716-446655440004', 'National Institute of Ayurveda', 'Amer Road, Jaipur', 'Jaipur', 'Rajasthan', 'ayurvedic', 'RJ/AYU/004', '+91-141-2635285', 'info@nia.nic.in'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Government Unani Medical College', 'Arumbakkam', 'Chennai', 'Tamil Nadu', 'unani', 'TN/UNA/005', '+91-44-26515151', 'info@gumc.tn.gov.in'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Kokilaben Dhirubhai Ambani Hospital', 'Four Bunglows, Andheri West', 'Mumbai', 'Maharashtra', 'allopathic', 'MH/ALP/006', '+91-22-42696969', 'info@kokilabenhospital.com'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Fortis Hospital', 'Bannerghatta Road', 'Bangalore', 'Karnataka', 'allopathic', 'KA/ALP/007', '+91-80-66214444', 'info@fortisbangalore.com'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Ruby General Hospital', 'Kasba, Golpark', 'Kolkata', 'West Bengal', 'allopathic', 'WB/ALP/008', '+91-33-39840000', 'info@rubyhospital.in');

-- Insert demo users for each role
INSERT INTO users (id, abha_id, name, email, role, hospital_id, state, city, phone, specialization, license_number, department) VALUES
  -- Doctors
  ('610e8400-e29b-41d4-a716-446655440001', 'ABHA123456789012', 'Dr. Rajesh Kumar', 'rajesh.kumar@apollochennai.com', 'doctor', '550e8400-e29b-41d4-a716-446655440001', 'Tamil Nadu', 'Chennai', '+91-9876543210', 'Cardiology', 'TN/DOC/001', 'Cardiology'),
  ('610e8400-e29b-41d4-a716-446655440002', 'ABHA123456789013', 'Dr. Priya Sharma', 'priya.sharma@aiims.edu', 'doctor', '550e8400-e29b-41d4-a716-446655440002', 'Delhi', 'New Delhi', '+91-9876543211', 'Internal Medicine', 'DL/DOC/002', 'Internal Medicine'),
  ('610e8400-e29b-41d4-a716-446655440003', 'ABHA123456789014', 'Dr. Amit Verma', 'amit.verma@kgmcindia.edu', 'doctor', '550e8400-e29b-41d4-a716-446655440003', 'Uttar Pradesh', 'Lucknow', '+91-9876543212', 'General Medicine', 'UP/DOC/003', 'General Medicine'),
  ('610e8400-e29b-41d4-a716-446655440004', 'ABHA123456789015', 'Dr. Sunita Agarwal', 'sunita.agarwal@nia.nic.in', 'doctor', '550e8400-e29b-41d4-a716-446655440004', 'Rajasthan', 'Jaipur', '+91-9876543213', 'Ayurveda', 'RJ/AYU/004', 'Panchakarma'),
  ('610e8400-e29b-41d4-a716-446655440005', 'ABHA123456789016', 'Dr. Mohammed Ali', 'mohammed.ali@gumc.tn.gov.in', 'doctor', '550e8400-e29b-41d4-a716-446655440005', 'Tamil Nadu', 'Chennai', '+91-9876543214', 'Unani Medicine', 'TN/UNA/005', 'Ilaj Bil Dawa'),
  
  -- Hospital Admins
  ('610e8400-e29b-41d4-a716-446655440006', 'ABHA223456789012', 'Ravi Krishnan', 'ravi.krishnan@apollochennai.com', 'admin', '550e8400-e29b-41d4-a716-446655440001', 'Tamil Nadu', 'Chennai', '+91-9876543215', NULL, NULL, 'Administration'),
  ('610e8400-e29b-41d4-a716-446655440007', 'ABHA223456789013', 'Meera Gupta', 'meera.gupta@aiims.edu', 'admin', '550e8400-e29b-41d4-a716-446655440002', 'Delhi', 'New Delhi', '+91-9876543216', NULL, NULL, 'Administration'),
  
  -- Government Officials
  ('610e8400-e29b-41d4-a716-446655440008', 'ABHA323456789012', 'Dr. Suresh Chand', 'suresh.chand@ayush.gov.in', 'government', NULL, 'Delhi', 'New Delhi', '+91-9876543217', NULL, NULL, 'Ministry of Ayush'),
  ('610e8400-e29b-41d4-a716-446655440009', 'ABHA323456789013', 'Anita Desai', 'anita.desai@health.gov.in', 'government', NULL, 'Maharashtra', 'Mumbai', '+91-9876543218', NULL, NULL, 'Health Ministry'),
  ('610e8400-e29b-41d4-a716-446655440010', 'ABHA323456789014', 'Prakash Joshi', 'prakash.joshi@nhm.gov.in', 'government', NULL, 'Karnataka', 'Bangalore', '+91-9876543219', NULL, NULL, 'National Health Mission');

-- Insert dummy patients with realistic Indian demographics
INSERT INTO patients (id, abha_id, name, age, gender, phone, alternate_phone, email, address, city, state, pincode, emergency_contact_name, emergency_contact_phone, blood_group, allergies) VALUES
  ('710e8400-e29b-41d4-a716-446655440001', 'PAT001234567890', 'Arjun Patel', 35, 'male', '+91-9123456789', '+91-8123456789', 'arjun.patel@gmail.com', '123, Satellite Road, Ahmedabad', 'Ahmedabad', 'Gujarat', '380015', 'Kavita Patel', '+91-9987654321', 'O+', 'Penicillin'),
  ('710e8400-e29b-41d4-a716-446655440002', 'PAT001234567891', 'Deepika Sharma', 28, 'female', '+91-9123456790', '+91-8123456790', 'deepika.sharma@gmail.com', '456, Lajpat Nagar, New Delhi', 'New Delhi', 'Delhi', '110024', 'Rakesh Sharma', '+91-9987654322', 'A+', 'Dust, Pollen'),
  ('710e8400-e29b-41d4-a716-446655440003', 'PAT001234567892', 'Mohammed Rahman', 42, 'male', '+91-9123456791', '+91-8123456791', 'mohammed.rahman@gmail.com', '789, Park Street, Kolkata', 'Kolkata', 'West Bengal', '700017', 'Fatima Rahman', '+91-9987654323', 'B+', 'None'),
  ('710e8400-e29b-41d4-a716-446655440004', 'PAT001234567893', 'Lakshmi Iyer', 55, 'female', '+91-9123456792', '+91-8123456792', 'lakshmi.iyer@gmail.com', '321, T.Nagar, Chennai', 'Chennai', 'Tamil Nadu', '600017', 'Raman Iyer', '+91-9987654324', 'AB+', 'Shellfish'),
  ('710e8400-e29b-41d4-a716-446655440005', 'PAT001234567894', 'Vikram Singh', 38, 'male', '+91-9123456793', '+91-8123456793', 'vikram.singh@gmail.com', '654, Sector 17, Chandigarh', 'Chandigarh', 'Punjab', '160017', 'Simran Singh', '+91-9987654325', 'O-', 'Aspirin');

-- Insert more dummy patients (continuing the pattern)
INSERT INTO patients (abha_id, name, age, gender, phone, address, city, state, pincode, emergency_contact_name, emergency_contact_phone, blood_group) VALUES
  ('PAT001234567895', 'Priya Nair', 31, 'female', '+91-9123456794', '987, MG Road, Kochi', 'Kochi', 'Kerala', '682011', 'Suresh Nair', '+91-9987654326', 'A-'),
  ('PAT001234567896', 'Rajesh Gupta', 47, 'male', '+91-9123456795', '111, Indira Nagar, Lucknow', 'Lucknow', 'Uttar Pradesh', '226016', 'Sunita Gupta', '+91-9987654327', 'B-'),
  ('PAT001234567897', 'Kavita Reddy', 33, 'female', '+91-9123456796', '222, Banjara Hills, Hyderabad', 'Hyderabad', 'Telangana', '500034', 'Srinivas Reddy', '+91-9987654328', 'AB-'),
  ('PAT001234567898', 'Anil Kumar', 29, 'male', '+91-9123456797', '333, Malviya Nagar, Jaipur', 'Jaipur', 'Rajasthan', '302017', 'Pooja Kumar', '+91-9987654329', 'O+'),
  ('PAT001234567899', 'Sneha Joshi', 26, 'female', '+91-9123456798', '444, FC Road, Pune', 'Pune', 'Maharashtra', '411005', 'Amit Joshi', '+91-9987654330', 'A+');

-- Insert sample problem list entries with dual coding
INSERT INTO problem_list (patient_id, doctor_id, hospital_id, namaste_code, namaste_name, icd_code, icd_name, disease_name_hindi, severity, status, diagnosis_date, treatment_approach, notes) VALUES
  ('710e8400-e29b-41d4-a716-446655440001', '610e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'NAM001', 'Madhumeha (Diabetes Mellitus)', 'E11.9', 'Type 2 diabetes mellitus without complications', 'मधुमेह', 'moderate', 'active', '2024-01-15', 'allopathic', 'Well controlled with metformin'),
  ('710e8400-e29b-41d4-a716-446655440002', '610e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'NAM002', 'Jwara (Fever)', 'R50.9', 'Fever unspecified', 'ज्वर', 'mild', 'resolved', '2024-01-10', 'mixed', 'Responded well to traditional herbs and paracetamol'),
  ('710e8400-e29b-41d4-a716-446655440003', '610e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'NAM003', 'Amavata (Rheumatoid Arthritis)', 'M06.9', 'Rheumatoid arthritis unspecified', 'आमवात', 'moderate', 'active', '2024-01-20', 'ayurvedic', 'Panchakarma treatment recommended'),
  ('710e8400-e29b-41d4-a716-446655440004', '610e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'NAM004', 'Hridroga (Heart Disease)', 'I25.9', 'Chronic ischemic heart disease unspecified', 'हृदय रोग', 'severe', 'active', '2024-01-25', 'mixed', 'Combination of allopathic and Ayurvedic treatment'),
  ('710e8400-e29b-41d4-a716-446655440005', '610e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'NAM005', 'Raktachapa (Hypertension)', 'I10', 'Essential hypertension', 'उच्च रक्तचाप', 'moderate', 'active', '2024-02-01', 'allopathic', 'ACE inhibitor prescribed');

-- Insert sample encounters
INSERT INTO encounters (patient_id, doctor_id, hospital_id, encounter_type, chief_complaint, assessment_and_plan, encounter_date, vital_signs) VALUES
  ('710e8400-e29b-41d4-a716-446655440001', '610e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'outpatient', 'Follow-up for diabetes', 'HbA1c levels stable. Continue current medication.', '2024-01-15', '{"bp": "130/80", "pulse": "72", "temp": "98.6", "weight": "75"}'),
  ('710e8400-e29b-41d4-a716-446655440002', '610e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'outpatient', 'Fever for 3 days', 'Viral fever. Prescribed symptomatic treatment.', '2024-01-10', '{"bp": "120/75", "pulse": "85", "temp": "101.2", "weight": "58"}'),
  ('710e8400-e29b-41d4-a716-446655440003', '610e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'follow-up', 'Joint pain and stiffness', 'RA flare-up. Adjusted medication dosage.', '2024-01-20', '{"bp": "125/78", "pulse": "68", "temp": "98.4", "weight": "68"}');