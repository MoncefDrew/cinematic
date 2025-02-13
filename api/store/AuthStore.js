import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export const useAuthStore = create((set, get) => ({
    user: null,
    session: null,
    initialized: false,
    loading: false,

    getUserInfo: async () => {
        try {
            set({ loading: true });

            // Get current user
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) return null;

            // Fetch user info from client table
            const { data, error } = await supabase
                .from('client')
                .select('username, photo_profil, email')
                .eq('email', currentUser.email)
                .single();

            if (error) {
                console.error('Error fetching user info:', error.message);
                return null;
            }

            // Update store with user info
            set({
                user: {
                    username: data.username,
                    photo_profile: data.photo_profile,
                    email: data.email
                },
                loading: false
            });

            return data;
        } catch (error) {
            console.error('Error in getUserInfo:', error);
            set({ loading: false });
            return null;
        }
    },

    setSession: (session) => {
        set({
            session,
            initialized: true,
            // Clear user info if session is null
            user: session ? get().user : null
        });
    },
    updateProfilePicture: (profilePicture) => set((state) => ({ user: { ...state.user, profilePicture } })),
    updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),

    signOut: async () => {
        try {
            set({ loading: true });
            await supabase.auth.signOut();
            set({
                user: null,
                session: null,
                loading: false
            });
        } catch (error) {
            console.error('Error signing out:', error);
            set({ loading: false });
        }
    }
}));

// Initialize auth state listener
supabase.auth.onAuthStateChange((event, session) => {
    useAuthStore.getState().setSession(session);

    // Fetch user info if session exists
    if (session) {
        useAuthStore.getState().getUserInfo();
    }
});