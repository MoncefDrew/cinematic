import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => set({ user: null }),
            updateProfilePicture: (profilePicture) => set((state) => ({ user: { ...state.user, profilePicture } })),
            updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),

        }),

        {
            name: 'auth-storage', // Key for AsyncStorage
            getStorage: () => AsyncStorage,
        }
    )
);
