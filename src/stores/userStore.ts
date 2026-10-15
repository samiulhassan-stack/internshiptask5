import { create } from 'zustand';
import { User, LoadingState } from '../types';

interface UserState {
  user: User | null;
  loadingState: LoadingState;
  error: string | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

// Simulated API call
const mockFetchUser = (): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: 'Jane Developer',
        email: 'jane@example.com',
        role: 'admin',
        avatar: '👩‍💻'
      });
    }, 1500); // Simulate network delay
  });
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loadingState: 'idle',
  error: null,

  fetchUser: async () => {
    set({ loadingState: 'loading', error: null });
    try {
      const user = await mockFetchUser();
      set({ user, loadingState: 'success' });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        loadingState: 'error' 
      });
    }
  },

  logout: () => {
    set({ user: null, loadingState: 'idle', error: null });
  }
}));
