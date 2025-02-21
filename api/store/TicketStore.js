import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './AuthStore';

// Create the store
export const useTicketStore = create(
    persist(
        (set) => ({
            tickets: [],
            loading: false,
            error: null,

            // Create a new ticket
            createTicket: async (projection_id, seatNumber) => {
                set({ loading: true });
                try {
                    const { user } = useAuthStore.getState(); // Get the current user
                    const username = user?.username;

                    if (!projection_id || !username) {
                        throw new Error('Missing projection_id or username.');
                    }

                    // Insert the ticket into the Supabase table
                    const { data, error } = await supabase
                        .from('ticket')
                        .insert([
                            {
                                projection_id,
                                username,
                                seat: {
                                    seatNumber,
                                    hall: 2, // Assuming hall is always 2
                                },
                            },
                        ])
                        .select(); // Return the inserted data

                    if (error) throw error;

                    // Update the local state with the new ticket
                    set((state) => ({
                        tickets: [...state.tickets, ...data],
                        error: null,
                    }));
                } catch (error) {
                    console.error('Error creating ticket:', error.message);
                    set({ error: error.message });
                } finally {
                    set({ loading: false });
                }
            },

            // Fetch tickets for the current user
            fetchTickets: async () => {
                set({ loading: true, error: null });
                try {
                    const { user } = useAuthStore.getState(); // Get the current user
                    const username = user?.username;

                    if (!username) {
                        throw new Error('User not authenticated');
                    }

                    // Fetch tickets with embedded projection and film data
                    const { data, error } = await supabase
                        .from('ticket')
                        .select(`
                            *,
                            projection:projection_id (
                                film_id,
                                projection_date,
                                start_time,
                                duration,
                                poster_url,
                                film:film_id (
                                    title
                                )
                            )
                        `)
                        .eq('username', username);

                    if (error) throw error;

                    // Update the local state with the fetched tickets
                    set({ tickets: data, error: null });
                } catch (error) {
                    console.error('Error fetching tickets:', error);
                    set({
                        error: error.message || 'Failed to fetch tickets',
                        tickets: [],
                    });
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'ticket-storage', // Name of the item in localStorage
            partialize: (state) => ({ tickets: state.tickets }), // Persist only tickets
        }
    )
);