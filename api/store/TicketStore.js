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

                createTicket: async (projection_id,seatNumber) => {
                set({ loading: true });

                try {
                    const { user } = useAuthStore.getState(); // Ensure correct Zustand method
                    const username = user?.username;

                    if (!projection_id || !username) {
                        throw new Error("Missing projection_id or username.");
                    }

                    const { data } = await axios.post('http://localhost:3000/api/ticket/', {
                        projection_id,
                        username,
                        seat:{
                            seatNumber , // Convert from seat number to index
                            hall:2
                        }
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
                    set({ loading: true });

                    try {
                        const { user } = useAuthStore.getState(); // Use getState() to access user

                        if (!user || !user.username) {
                            throw new Error('User not authenticated');
                        }

                        console.log('Fetching tickets for user:', user.username);

                        const response = await axios.get(
                            `http://localhost:3000/api/client/${user.username}/tickets`
                        );

                        console.log('Tickets response:', response.data);

                        if (!response.data || !response.data.tickets) {
                            throw new Error('Invalid response format');
                        }

                        set({
                            tickets: response.data.tickets,
                            error: null
                        });
                    } catch (error) {
                        console.error('Error fetching tickets:', error);
                        set({
                            error: error.message || 'Failed to fetch tickets',
                            tickets: []
                        });
                    } finally {
                        set({ loading: false });
                    }
                },
            }

        )
)
)