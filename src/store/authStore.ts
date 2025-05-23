import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Simple validation (in a real app, this would be a server call)
    if (email && password) {
      set({
        isAuthenticated: true,
        user: {
          id: '1',
          name: 'Sarah Connor',
          email: email,
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        }
      });
      return true;
    }
    return false;
  },
  logout: () => {
    set({
      isAuthenticated: false,
      user: null
    });
  }
}));