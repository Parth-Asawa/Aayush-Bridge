import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { DoctorDashboard } from './components/dashboard/DoctorDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { GovernmentDashboard } from './components/dashboard/GovernmentDashboard';
import { PatientSearch } from './components/doctor/PatientSearch';
import { PatientDetail } from './components/doctor/PatientDetail';
import { MorbidityAnalytics } from './components/government/MorbidityAnalytics';
import { useAuthStore } from './store/auth-store';

const queryClient = new QueryClient();

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'doctor':
      return <DoctorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'government':
      return <GovernmentDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* Doctor Routes */}
                    <Route
                      path="/patients"
                      element={
                        <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                          <PatientSearch />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/patients/:id"
                      element={
                        <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                          <PatientDetail />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Government Routes */}
                    <Route
                      path="/morbidity-analytics"
                      element={
                        <ProtectedRoute allowedRoles={['government']}>
                          <MorbidityAnalytics />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Placeholder routes for other features */}
                    <Route
                      path="/encounters"
                      element={
                        <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                          <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Encounters</h2>
                            <p className="text-gray-600">This feature is under development.</p>
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/analytics"
                      element={
                        <ProtectedRoute>
                          <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
                            <p className="text-gray-600">This feature is under development.</p>
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/staff"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Staff Management</h2>
                            <p className="text-gray-600">This feature is under development.</p>
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'government']}>
                          <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2>
                            <p className="text-gray-600">This feature is under development.</p>
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/regional-data"
                      element={
                        <ProtectedRoute allowedRoles={['government']}>
                          <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Regional Data</h2>
                            <p className="text-gray-600">This feature is under development.</p>
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/disease-surveillance"
                      element={
                        <ProtectedRoute allowedRoles={['government']}>
                          <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disease Surveillance</h2>
                            <p className="text-gray-600">This feature is under development.</p>
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;