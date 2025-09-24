import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [abhaId, setAbhaId] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!abhaId.trim()) {
      setError('Please enter your ABHA ID');
      return;
    }

    try {
      await login(abhaId);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const demoCredentials = [
    { role: 'Doctor', abhaId: 'ABHA123456789012', name: 'Dr. Rajesh Kumar' },
    { role: 'Admin', abhaId: 'ABHA223456789012', name: 'Ravi Krishnan' },
    { role: 'Government', abhaId: 'ABHA323456789012', name: 'Dr. Suresh Chand' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">EMR System</h2>
          <p className="mt-2 text-gray-600">Electronic Medical Record System</p>
          <p className="text-sm text-gray-500">With NAMASTE & ICD-11 Integration</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="abhaId" className="block text-sm font-medium text-gray-700 mb-2">
                ABHA ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="abhaId"
                  type="text"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  placeholder="Enter your ABHA ID"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Signing in...
                </>
              ) : (
                'Sign in with ABHA'
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.abhaId}
                  type="button"
                  onClick={() => setAbhaId(cred.abhaId)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="font-medium text-sm text-gray-900">{cred.role}: {cred.name}</div>
                  <div className="text-xs text-gray-500">{cred.abhaId}</div>
                </button>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              * This is a demo system with mock ABHA authentication for MVP testing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};