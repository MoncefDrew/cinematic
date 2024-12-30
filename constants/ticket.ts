export interface Ticket {
    id: number;
    movieTitle: string;
    date: string;
    time: string;
    seat: string;
}

export const sampleTickets: Ticket[] = [
    {
        id: 1,
        movieTitle: "Inception",
        date: "30 Dec 2024",
        time: "19:30",
        seat: "H12"
    },
    {
        id: 2,
        movieTitle: "The Dark Knight",
        date: "2 Jan 2025",
        time: "20:00",
        seat: "F8"
    }
];