import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

// Create the store
export const useProjectionStore = create(
    persist(
        (set) => ({
            projections: [],
            loading: false,
            error: null,
            fetchProjections: async () => {
                set({ loading: true })
                try {
                    const { data } = await axios.get('http://localhost:3000/api/projection')
                    set({ projections: data, error: null })
                } catch (error) {
                    set({
                        error: 'Failed to fetch projections',
                        projections: []
                    })
                } finally {
                    set({ loading: false })
                }
            },



        }),
        {
            name: 'projection-storage', // name of the item in localStorage
            partialize: (state) => ({ projections: state.projections }),
        }
    )
)