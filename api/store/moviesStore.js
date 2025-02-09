import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

// Create the store
export const useMovieStore = create(
    persist(
        (set) => ({
            movies: [],
            featuredMovie: null, // Add a featuredMovie variable
            filteredMovies: [], // Add this
            loading: false,
            error: null,
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


            fetchFeaturedMovie: async () => {
                set({ loading: true });
                try {

                    const {data} = await axios.get('http://localhost:3000/api/film/featured'); // Call your API route

                    set({ featuredMovie: data.featuredMovie, loading: false }); // Update the store
                } catch (error) {
                    set({ error: error.message, loading: false });
                    console.error('Error fetching featured movie:', error);
                }
            },


            clearMovies: () => set({ movies: [] }),
        }),
        {
            name: 'movie-storage', // name of the item in localStorage
            partialize: (state) => ({ movies: state.movies }),
        }
    )
)