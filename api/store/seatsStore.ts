// seatStore.ts
import {create} from 'zustand';
import axios from 'axios';

interface Seat {
    taken: boolean;
    number: number;
    selected?: boolean;
}

interface SeatStore {
    seats: Seat[];
    loading: boolean;
    error: string | null;
    selectedSeat: number | null;
    fetchSeats: (projectionId: string) => Promise<void>;
    selectSeat: (seatIndex: number) => void;
    reserveSeat: (projectionId: string, seatNumber: number) => Promise<void>;
}

export const  useSeatStore = create<SeatStore>((set, get) => ({
    seats: [],
    loading: false,
    error: null,
    selectedSeat: null,

    fetchSeats: async (projectionId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`http://localhost:3000/api/projection/${projectionId}/seats`);
            const seatsData = response.data[0].seats.map((seat: Seat) => ({
                ...seat,
                selected: false
            }));
            set({ seats: seatsData, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch seats', loading: false });
        }
    },

    selectSeat: (seatIndex: number) => {
        const { seats } = get();
        if (seats[seatIndex].taken) return;

        const updatedSeats = seats.map((seat, index) => ({
            ...seat,
            selected: index === seatIndex ? !seat.selected : false
        }));

        set({
            seats: updatedSeats,
            selectedSeat: updatedSeats[seatIndex].selected ? seatIndex : null
        });
    },

    reserveSeat: async (projectionId: string, seatNumber: number) => {
        set({ loading: true, error: null });
        try {
            await axios.post(`http://localhost:3000/api/projection/${projectionId}/seats`, {
                seatIndex: seatNumber , // Convert from seat number to index
                reserved:true,

            });

            const { seats } = get();
            const updatedSeats = seats.map(seat =>
                seat.number === seatNumber ? { ...seat, reserved: true, selected: false } : seat
            );

            set({
                seats: updatedSeats,
                selectedSeat: null,
                loading: false
            });
        } catch (error) {
            set({
                error: 'Failed to reserve seat',
                loading: false
            });
        }
    },
}));

