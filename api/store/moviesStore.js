import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useMovieStore = create(
    persist(
        (set, get) => ({
            movies: [],
            popularMovies : [],
            featuredMovie: null,
            filteredMovies: [],
            moviesByGenre: {},
            selectedGenre: null,
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
                        .limit(10)

                    if (error) throw error;

                    set({ popularMovies: data, error: null });
                } catch (error) {
                    set({ error: 'Failed to fetch popular movies', popularMovies: [] });
                } finally {
                    set({ loading: false });
                }
            },

            fetchMoviesByGenre: async (genre) => {
                set({ loading: true });
                try {
                    const { data, error } = await supabase
                        .from('film')
                        .select('*')
                        .contains('genre', [genre])
                        .order('rating', { ascending: false });

                    if (error) throw error;

                    // Update moviesByGenre with the new data
                    set(state => ({
                        moviesByGenre: {
                            ...state.moviesByGenre,
                            [genre]: data
                        },
                        selectedGenre: genre,
                        error: null
                    }));

                    return data;
                } catch (error) {
                    set({ error: `Failed to fetch ${genre} movies` });
                    return [];
                } finally {
                    set({ loading: false });
                }
            },

            fetchPopularByGenre: async (genre) => {
                set({ loading: true });
                try {
                    const { data, error } = await supabase
                        .from('film')
                        .select('*')
                        .contains('genre', [genre])
                        .order('rating', { ascending: false })
                        .limit(10);

                    if (error) throw error;

                    // Update moviesByGenre with the new data
                    set(state => ({
                        moviesByGenre: {
                            ...state.moviesByGenre,
                            [genre]: data
                        },
                        error: null
                    }));

                    return data;
                } catch (error) {
                    set({ error: `Failed to fetch popular ${genre} movies` });
                    return [];
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

            clearMovies: () => set({
                movies: [],
                moviesByGenre: {},
                selectedGenre: null
            }),
        }),
        {
            name: 'movie-storage',
            getStorage: () => AsyncStorage, // Use AsyncStorage as the storage mechanism

        },
        
    )
);