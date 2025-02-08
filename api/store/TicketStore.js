import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

// Create the store
export const useMovieStore = create(
    persist(
        (set) => ({
                tickets: [],
                loading: false,
                error: null,
                fetchTickets: async () => {
                    set({ loading: true })
                    try {
                        const { data } = await axios.get(`http://localhost:3000/api/ticket/${client_id}`)
                        set({ tickets: data, error: null })
                    } catch (error) {
                        set({
                            error: 'Failed to fetch movies',
                            tickets: []
                        })
                    } finally {
                        set({ loading: false })
                    }
                },

        )
)