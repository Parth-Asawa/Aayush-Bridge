# EMR System - Electronic Medical Record with NAMASTE & ICD-11 Integration

A comprehensive Electronic Medical Record (EMR) system built for the Indian healthcare ecosystem, featuring dual coding terminology integration (NAMASTE + ICD-11) and role-based access control for doctors, hospital administrators, and government officials.

## 🚀 Features

### Authentication & Access Control
- **Mock ABHA OAuth Integration** (Production ready for real ABHA)
- **Role-Based Access Control**: Doctor, Hospital Admin, Government Official
- **Secure Session Management** with persistent login

### Doctor Workflow
- **Patient Search & Management**: Search by ABHA ID, name, or phone
- **Patient Detail View**: Complete medical history and demographics
- **Disease Addition Modal**: Real-time dual coding search (NAMASTE + ICD-11)
- **Problem List Management**: Track active diagnoses and treatments
- **Encounter Recording**: Document patient visits and treatments

### Hospital Administration
- **Hospital-wide Analytics**: Patient load, department performance
- **Staff Management**: Doctor and hospital staff oversight
- **Patient Management**: Access to all hospital patient records
- **Comprehensive Reporting**: Generate hospital-specific analytics

### Government Surveillance
- **Morbidity Analytics**: State-wise and city-wise disease surveillance
- **Interactive Dashboards**: Real-time health monitoring for Ministry of Ayush
- **Disease Trend Analysis**: Traditional vs. Allopathic treatment patterns
- **Export Capabilities**: CSV/PDF reports for government use

### Technology Integration
- **External Terminology API**: Dual coding with fallback mock data
- **Supabase Backend**: PostgreSQL with Row Level Security (RLS)
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Mobile and desktop optimized

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS with Lucide React icons
- **State Management**: Zustand + React Query
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Mock ABHA OAuth (Production ready)
- **Charts**: Recharts for analytics visualization
- **External API**: Configurable terminology microservice

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (for production)
- Access to terminology microservice API (optional, has fallback)

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd emr-system
npm install
```

### 2. Configure Environment Variables
```bash
# Copy the environment template
cp .env.example .env

# Update .env with your configuration:
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_TERMINOLOGY_API_HOST=https://your-ngrok-url.ngrok-free.app
VITE_TERMINOLOGY_API_KEY=your-api-key
```

### 3. Set Up Supabase Database
1. Create a new Supabase project
2. Run the SQL migrations in the Supabase SQL editor:
   - Execute `/supabase/migrations/create_initial_schema.sql`
   - Execute `/supabase/migrations/seed_initial_data.sql`

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` and use these demo credentials:

## 🔑 Demo Credentials

### Doctor Account
- **ABHA ID**: `ABHA123456789012`
- **Name**: Dr. Rajesh Kumar
- **Specialization**: Cardiology

### Hospital Admin Account  
- **ABHA ID**: `ABHA223456789012`
- **Name**: Ravi Krishnan
- **Role**: Hospital Administrator

### Government Official Account
- **ABHA ID**: `ABHA323456789012`
- **Name**: Dr. Suresh Chand
- **Role**: Ministry of Ayush Official

## 🏗 System Architecture

### Database Schema
- **hospitals**: Hospital information and metadata
- **users**: Role-based user accounts (doctor/admin/government)
- **patients**: Patient demographics and medical information
- **problem_list**: Dual-coded diagnoses (NAMASTE + ICD-11)
- **encounters**: Medical encounters and treatment records
- **audit_logs**: Complete audit trail for compliance

### Security Features
- **Row Level Security (RLS)**: Database-level access control
- **Role-based Permissions**: Granular access by user role
- **Audit Logging**: Complete system activity tracking
- **Input Validation**: Client and server-side validation

## 🔌 External API Integration

The system integrates with an external terminology microservice for dual coding:

```javascript
// Configure in .env
VITE_TERMINOLOGY_API_HOST=https://your-ngrok-url.ngrok-free.app
VITE_TERMINOLOGY_API_KEY=your-api-key

// API Endpoints
GET  /api/search?term={search_term}  // Search diseases
POST /api/diagnosis                  // Save diagnosis
```

**Fallback System**: If external API is unavailable, the system uses comprehensive mock data to ensure uninterrupted operation.

## 📊 Key Features by Role

### 👨‍⚕️ Doctor Dashboard
- Patient search and management
- Real-time disease coding with dual terminology
- Electronic problem list maintenance
- Encounter documentation
- Personal analytics and patient trends

### 🏥 Hospital Admin Dashboard
- Hospital-wide patient analytics
- Department performance metrics
- Staff management and scheduling
- Resource utilization reports
- Quality metrics tracking

### 🏛️ Government Dashboard
- State-wise morbidity surveillance
- Traditional medicine usage analytics
- Disease trend monitoring
- Public health reporting
- Ministry of Ayush compliance tracking

## 🔒 Security & Compliance

- **HIPAA-Ready Architecture**: Encrypted data transmission and storage
- **Audit Trail**: Complete activity logging for compliance
- **Role-Based Access**: Granular permissions by user type
- **Data Privacy**: Patient data protection and anonymization options
- **Secure API Integration**: Token-based authentication with external services

## 🚀 Production Deployment

### Environment Configuration
1. Set up production Supabase instance
2. Configure real ABHA OAuth integration
3. Set up terminology microservice endpoint
4. Configure production environment variables

### Database Migration
```sql
-- Run migration files in order:
1. create_initial_schema.sql
2. seed_initial_data.sql (modify for production data)
```

### Security Checklist
- [ ] Enable RLS on all tables
- [ ] Configure proper CORS settings
- [ ] Set up SSL certificates
- [ ] Configure rate limiting
- [ ] Enable audit logging
- [ ] Set up backup procedures

## 📈 Analytics & Reporting

### Government Analytics
- Real-time morbidity tracking
- State and city-wise disease distribution
- Traditional vs. allopathic treatment ratios
- Seasonal disease pattern analysis
- Export capabilities (CSV, PDF)

### Hospital Analytics
- Patient load by department
- Disease prevalence trends
- Treatment outcome metrics
- Resource utilization reports
- Doctor performance analytics

## 🤝 API Integration Guide

### Terminology Microservice Integration
The system is designed to integrate with external terminology services:

```typescript
// Example API integration
const searchDiseases = async (term: string) => {
  const response = await fetch(`${API_HOST}/api/search?term=${term}`, {
    headers: {
      'x-api-key': API_KEY,
      'ngrok-skip-browser-warning': 'true'
    }
  });
  return response.json();
};
```

### Fallback System
Comprehensive mock data ensures system availability even when external APIs are unavailable.

## 🔧 Development

### File Structure
```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── doctor/         # Doctor-specific features
│   ├── government/     # Government analytics
│   ├── dashboard/      # Role-based dashboards
│   └── layout/         # App layout components
├── lib/
│   ├── supabase.ts     # Database client & types
│   └── terminology-api.ts  # External API integration
├── store/
│   └── auth-store.ts   # Authentication state management
└── App.tsx             # Main application router
```

### Key Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🏥 Healthcare Compliance

### NAMASTE Integration
- Complete dual coding support (NAMASTE + ICD-11)
- Hindi disease name support
- Traditional medicine treatment tracking
- Ministry of Ayush reporting compliance

### Clinical Features
- Problem-oriented medical records
- Structured data entry with validation
- Clinical decision support integration ready
- Interoperability standards compliance

## 📞 Support & Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_TERMINOLOGY_API_HOST` | External API endpoint | No* |
| `VITE_TERMINOLOGY_API_KEY` | API authentication key | No* |

*Fallback mock data available

### Configuration Notes
- The system works with mock data for demonstration
- External API integration is optional but recommended for production
- All sensitive configuration should be environment-based
- Database migrations include comprehensive seed data

## 🎯 Next Steps for Production

1. **Real ABHA Integration**: Replace mock authentication with production ABHA OAuth
2. **Terminology Service**: Deploy and configure production terminology microservice
3. **Advanced Analytics**: Implement machine learning for disease prediction
4. **Mobile Applications**: Develop companion mobile apps for doctors
5. **Integration APIs**: Build APIs for third-party EHR system integration

## 📝 License

This project is intended for healthcare system demonstration and educational purposes. Please ensure compliance with local healthcare regulations and data protection laws before production deployment.

---

**Built with ❤️ for Indian Healthcare Ecosystem**

*Featuring dual coding support for traditional and modern medicine integration*