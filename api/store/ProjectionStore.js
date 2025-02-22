import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create the store
export const useProjectionStore = create(
    persist(
        (set, get) => ({
            projections: [],
            loading: false,
            error: null,

            // Fetch all projections
            fetchProjections: async () => {
                set({ loading: true });
                try {
                    const { data, error } = await supabase
                        .from('projection')
                        .select('*')
                        .order('projection_date', { ascending: true });

                    if (error) throw error;

                    set({ projections: data, error: null });
                } catch (error) {
                    set({ error: 'Failed to fetch projections', projections: [] });
                } finally {
                    set({ loading: false });
                }
            },

            // Fetch seats for a specific projection
            fetchSeats: async (projectionId) => {
                set({ loading: true });
                try {
                    const { data, error } = await supabase
                        .from('projection')
                        .select('seats')
                        .eq('projection_id', projectionId)
                        .single();

                    if (error) throw error;
                    set({
                        seats:data
                    })
                    return data.seats; // Return the seats array
                } catch (error) {
                    set({ error: 'Failed to fetch seats' });
                    console.error('Error fetching seats:', error);
                    return null;
                } finally {
                    set({ loading: false });
                }
            },

            // Reserve a seat for a specific projection
            reserveSeat: async (projectionId, seatIndex) => {
                set({ loading: true });
                try {
                    // Fetch the current seats
                    const { data: projectionData, error: fetchError } = await supabase
                        .from('projection')
                        .select('seats')
                        .eq('projection_id', projectionId)
                        .single();

                    if (fetchError) throw fetchError;

                    const seats = projectionData.seats;

                    // Check if the seat is already reserved
                    if (seats[seatIndex].reserved) {
                        throw new Error('Seat already reserved');
                    }

                    // Mark the seat as reserved
                    seats[seatIndex].reserved = true;

                    // Update the seats in the database
                    const { error: updateError } = await supabase
                        .from('projection')
                        .update({ seats })
                        .eq('projection_id', projectionId);

                    if (updateError) throw updateError;

                    // Update the local state (optional)
                    const updatedProjections = get().projections.map((projection) => {
                        if (projection.projection_id === projectionId) {
                            return { ...projection, seats };
                        }
                        return projection;
                    });

                    set({ projections: updatedProjections, error: null });
                } catch (error) {
                    set({ error: error.message });
                    console.error('Error reserving seat:', error);
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'projection-storage', // Name of the item in localStorage
            getStorage: () => AsyncStorage, // Use AsyncStorage as the storage mechanism
            partialize: (state) => ({ projections: state.projections }), // Persist only projections
        }
    )
);