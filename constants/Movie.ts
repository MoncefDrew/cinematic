import {fetchFilms} from "@/api/MoviesApi";

export type RootStackParamList = {
    Landing: undefined;
    SignIn: undefined;
    SignUp: undefined;
    MainApp: undefined; // For the drawer navigator
    MovieDetails:undefined;
    Popular:undefined;
    ReserveTicket:undefined;
    TicketPage:undefined;
};


export interface Movie {
    id: string;
    poster_url: string;
    title: string;
    cover_url?: string;
    release_date?: number;
    description?: string;
    genre?:[string];
    duration?:number;
    directedBy?: string;
}

//Movies list for Movies vote testing
export const moviesVotes = [
    {
        id: 1,
        title: "Inception",
        poster: "https://a.ltrbxd.com/resized/sm/upload/sv/95/s9/4j/inception-0-2000-0-3000-crop.jpg?v=30d7224316",
        cover: "https://m.media-amazon.com/images/I/91V7iJ7l7LL._AC_SY679_.jpg",
        Evaluation: 8.8,
        projectionDate: "2024-12-31",
        projectionTime: "20:00",
        dateReleased: 2010,
        Description: "A skilled thief is given a chance to erase his criminal record if he successfully performs an inception.",
        directedBy: "Christopher Nolan",
        votes: 0,
    },
    {
        id: 2,
        title: "The Dark Knight",
        poster: "https://a.ltrbxd.com/resized/sm/upload/78/y5/zg/ej/oefdD26aey8GPdx7Rm45PNncJdU-0-2000-0-3000-crop.jpg?v=2d0ce4be25",
        cover: "https://m.media-amazon.com/images/I/51UPgRbzfdL._AC_.jpg",
        Evaluation: 9.0,
        projectionDate: "2024-01-10",
        projectionTime: "19:30",
        dateReleased: 2008,
        Description: "Batman faces off against the Joker, a criminal mastermind who seeks to create chaos in Gotham.",
        directedBy: "Christopher Nolan",
        votes: 0,

    },
    {
        id: 3,
        title: "Interstellar",
        poster: "https://a.ltrbxd.com/resized/film-poster/1/1/7/6/2/1/117621-interstellar-0-2000-0-3000-crop.jpg?v=7ad89e6666",
        cover: "https://m.media-amazon.com/images/I/71Lfw7Rh1lL._AC_SY679_.jpg",
        Evaluation: 8.6,
        projectionDate: "2024-02-05",
        projectionTime: "21:00",
        dateReleased: 2014,
        Description: "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
        directedBy: "Christopher Nolan",
        votes: 0,

    },
]



//movies list
const moviesList: Promise<T | any[]> =  fetchFilms();
export default moviesList;