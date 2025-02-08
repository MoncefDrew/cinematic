import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import {useAuthStore} from "./AuthStore";

// Create the store
export const useTicketStore = create(
    persist(
        (set) => ({
                tickets: [],
                loading: false,
                error: null,

                createTicket: async (projection_id) => {
                set({ loading: true });

                try {
                    const { user } = useAuthStore.getState(); // Ensure correct Zustand method
                    const username = user?.username;

                    if (!projection_id || !username) {
                        throw new Error("Missing projection_id or username.");
                    }

                    console.log("Sending request to API...");
                    const { data } = await axios.post('http://localhost:3000/api/ticket/', {
                        projection_id,
                        username,
                    });

                    console.log("Response from API:", data);

                    set({ tickets: data, error: null });
                } catch (error) {
                    console.error("Error creating ticket:", error.message);
                    set({ error: error.message });
                } finally {
                    set({ loading: false });
                }
            },

                fetchTickets: async () => {
                    set({ loading: true })
                    try {
                        const { data } = await axios.get(`http://localhost:3000/api/ticket/${user.username}`)
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

            }

        )
)
)