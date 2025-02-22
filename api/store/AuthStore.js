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
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) return null;

            const { data, error } = await supabase
                .from('client')
                .select('username, photo_profil, email, client_id')
                .eq('email', currentUser.email)
                .single();

            if (error) {
                console.error('Error fetching user info:', error.message);
                return null;
            }

            set({
                user: {
                    username: data.username,
                    photo_profile: data.photo_profil,
                    email: data.email,
                    user_id: data.client_id
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

    updateProfilePicture: async (photoUri) => {
        try {
            set({ loading: true });
            const user = get().user;
            if (!user) throw new Error('No user found');

            // Generate unique file name
            const fileExt = photoUri.split('.').pop();
            const fileName = `${user.user_id}-${Date.now()}.${fileExt}`;
            const filePath = `profile_pictures/${fileName}`;

            // Convert the local file URI to a Blob
            const response = await fetch(photoUri);
            const blob = await response.blob();

            // Upload image to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('profiles')
                .upload(filePath, blob, {
                    contentType: 'image/jpeg', // Adjust based on your needs
                });

            if (uploadError) throw uploadError;

            // Get public URL for the uploaded image
            const { data: { publicUrl } } = supabase.storage
                .from('profiles')
                .getPublicUrl(filePath);

            // Update user profile in database
            const { error: updateError } = await supabase
                .from('client')
                .update({ photo_profil: publicUrl })
                .eq('client_id', user.user_id);

            if (updateError) throw updateError;

            // Update local state
            set(state => ({
                user: { ...state.user, photo_profile: publicUrl },
                loading: false
            }));

            return publicUrl;
        } catch (error) {
            console.error('Error updating profile picture:', error);
            set({ loading: false });
            throw error;
        }
    },    setSession: (session) => {
        set({
            session,
            initialized: true,
            user: session ? get().user : null
        });
    },

    updateUser: async (userData) => {
        try {
            set({ loading: true });
            const user = get().user;
            if (!user) throw new Error('No user found');

            const { error } = await supabase
                .from('client')
                .update(userData)
                .eq('client_id', user.user_id);

            if (error) throw error;

            set(state => ({
                user: { ...state.user, ...userData },
                loading: false
            }));
        } catch (error) {
            console.error('Error updating user:', error);
            set({ loading: false });
            throw error;
        }
    },

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
    if (session) {
        useAuthStore.getState().getUserInfo();
    }
});
