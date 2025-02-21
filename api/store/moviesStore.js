import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create the store
export const useMovieStore = create(
    persist(
        (set) => ({
            movies: [],
            featuredMovie: null,
            filteredMovies: [],
            loading: false,
            error: null,

            fetchMovies: async () => {
                set({ loading: true });
                try {
                    const { data, error } = await supabase
                        .from('film')
                        .select('*');

                    if (error) throw error;

                    set({ movies: data, error: null });
                } catch (error) {
                    set({ error: 'Failed to fetch movies', movies: [] });
                } finally {
                    set({ loading: false });
                }
            },

            fetchPopular: async () => {
                set({ loading: true });
                try {
                    const { data, error } = await supabase
                        .from('film')
                        .select('*')
                        .order('rating', { ascending: false })
                        .limit(10);

                    if (error) throw error;

                    set({ movies: data, error: null });
                } catch (error) {
                    set({ error: 'Failed to fetch popular movies', movies: [] });
                } finally {
                    set({ loading: false });
                }
            },

            setFilteredMovies: (movies) => set({ filteredMovies: movies }),

            fetchFeaturedMovie: async () => {
                set({ loading: true });
                try {
                    const { data, error } = await supabase
                        .from('film')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single();

                    if (error) throw error;

                    set({ featuredMovie: data, loading: false });
                } catch (error) {
                    set({ error: error.message, loading: false });
                    console.error('Error fetching featured movie:', error);
                }
            },

            clearMovies: () => set({ movies: [] }),
        }),
        {
            name: 'movie-storage',
            partialize: (state) => ({ movies: state.movies }),
        }
    )
);