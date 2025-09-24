import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (abhaId: string) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
}

// Mock ABHA authentication for MVP
const mockUsers: Record<string, User> = {
  'ABHA123456789012': {
    id: '610e8400-e29b-41d4-a716-446655440001',
    abha_id: 'ABHA123456789012',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@apollochennai.com',
    role: 'doctor',
    hospital_id: '550e8400-e29b-41d4-a716-446655440001',
    state: 'Tamil Nadu',
    city: 'Chennai',
    phone: '+91-9876543210',
    specialization: 'Cardiology',
    license_number: 'TN/DOC/001',
    department: 'Cardiology',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  'ABHA223456789012': {
    id: '610e8400-e29b-41d4-a716-446655440006',
    abha_id: 'ABHA223456789012',
    name: 'Ravi Krishnan',
    email: 'ravi.krishnan@apollochennai.com',
    role: 'admin',
    hospital_id: '550e8400-e29b-41d4-a716-446655440001',
    state: 'Tamil Nadu',
    city: 'Chennai',
    phone: '+91-9876543215',
    department: 'Administration',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  'ABHA323456789012': {
    id: '610e8400-e29b-41d4-a716-446655440008',
    abha_id: 'ABHA323456789012',
    name: 'Dr. Suresh Chand',
    email: 'suresh.chand@ayush.gov.in',
    role: 'government',
    state: 'Delhi',
    city: 'New Delhi',
    phone: '+91-9876543217',
    department: 'Ministry of Ayush',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (abhaId: string): Promise<User> => {
        set({ isLoading: true });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = mockUsers[abhaId];
          
          if (!user) {
            throw new Error('Invalid ABHA ID or user not found');
          }

          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });

          return user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      },

      updateUser: (user: User) => {
        set({ user });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);