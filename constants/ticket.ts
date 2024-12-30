export interface Ticket {
    id: number;
    movieTitle: string;
    date: {
        date:string;
        day:string;
    }
    time: string;
    seat: number;
    ticketImage:string;
}

