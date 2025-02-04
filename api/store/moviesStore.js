import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

// Create the store
export const useMovieStore = create(
    persist(
        (set) => ({
            movies: [],
            loading: false,
            error: null,
            filteredMovies: [], // Add this
            fetchMovies: async () => {
                set({ loading: true })
                try {
                    const { data } = await axios.get('http://localhost:3000/api/film')
                    set({ movies: data, error: null })
                } catch (error) {
                    set({
                        error: 'Failed to fetch movies',
                        movies: []
                    })
                } finally {
                    set({ loading: false })
                }
            },

            fetchPopular : async () =>{
                set({loading:true})
                try {
                    const { data } = await axios.get(`http://localhost:3000/api/film/popular`);
                    set({ movies: data, error: null })
                } catch (error) { set({
                    error: 'Failed to fetch popular movies',
                    movies: []
                })
                } finally {
                    set({ loading: false })
                }
            },

            setFilteredMovies: (movies) => set({ filteredMovies: movies }), // Add this



            clearMovies: () => set({ movies: [] }),
        }),
        {
            name: 'movie-storage', // name of the item in localStorage
            partialize: (state) => ({ movies: state.movies }),
        }
    )
)