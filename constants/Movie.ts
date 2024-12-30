import {MovieVote} from "@/constants/MoviePoll";
export type RootStackParamList = {
    Popular: undefined; // Popular page does not require any parameters
    MovieDetails: { movie: Movie }; // MovieDetails expects a `movie` parameter
};

export interface Movie {
    id: number;
    poster: string;
    title: string;
    cover?: string;
    Evaluation?: number;
    projectionDate?: string;
    projectionTime?: string;
    dateReleased?: number;
    Description?: string;
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
const moviesList: Movie[] = [
    {
        id: 1,
        title: "Avatar: The Way of Water",
        poster: "https://image.tmdb.org/t/p/w500/2eRONXg73hBqEtb5KXmUO67fN1g.jpg",
        cover: "https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
        Evaluation: 7.9,
        projectionDate: "2024-12-15",
        projectionTime: "19:00",
        dateReleased: 2022,
        Description: "Jake Sully and Ney'tiri must protect their family and their people as a new threat emerges in Pandora.",
        directedBy: "James Cameron",
    },
    {
        id: 2,
        title: "Dune: Part Two",
        poster: "https://image.tmdb.org/t/p/w500/d7eMlkrEY0hUfjJDi1fZd6Dszp3.jpg",
        cover: "https://image.tmdb.org/t/p/w780/2AvP3vYb3XEdTEqBtM4LYrL0CTW.jpg",
        Evaluation: 8.5,
        projectionDate: "2024-11-01",
        projectionTime: "20:30",
        dateReleased: 2024,
        Description: "Paul Atreides unites with the Fremen to exact revenge against those who destroyed his family.",
        directedBy: "Denis Villeneuve",
    },
    {
        id: 3,
        title: "Oppenheimer",
        poster: "https://image.tmdb.org/t/p/w500/bfwqybqTgKqX4RzXpaGfDuf8s3W.jpg",
        cover: "https://image.tmdb.org/t/p/w780/fgsfNyi5vIoO3h9Ox3Tkl9REX7R.jpg",
        Evaluation: 8.7,
        projectionDate: "2024-10-20",
        projectionTime: "18:00",
        dateReleased: 2023,
        Description: "The story of J. Robert Oppenheimer and his role in the creation of the atomic bomb.",
        directedBy: "Christopher Nolan",
    },
    {
        id: 4,
        title: "Mission: Impossible - Dead Reckoning Part One",
        poster: "https://image.tmdb.org/t/p/w500/bLQAZkb0LZsFO98xR8fsnpQm4Bl.jpg",
        cover: "https://image.tmdb.org/t/p/w780/sEi1GGHcl4aGEidM1m1yZy3s2h6.jpg",
        Evaluation: 8.1,
        projectionDate: "2024-09-05",
        projectionTime: "21:00",
        dateReleased: 2023,
        Description: "Ethan Hunt and his team face their most dangerous mission yet as they confront a mysterious new weapon.",
        directedBy: "Christopher McQuarrie",
    },
    {
        id: 5,
        title: "Barbie",
        poster: "https://image.tmdb.org/t/p/w500/r74WElQbFWb9Ns2NDH3NOQkhZol.jpg",
        cover: "https://image.tmdb.org/t/p/w780/rgZ3hdzgMgYgzvBfwNEVW01bpK1.jpg",
        Evaluation: 7.4,
        projectionDate: "2024-07-10",
        projectionTime: "16:00",
        dateReleased: 2023,
        Description: "Barbie ventures into the real world to discover the meaning of true happiness.",
        directedBy: "Greta Gerwig",
    },
    {
        id: 6,
        title: "Spider-Man: Across the Spider-Verse",
        poster: "https://image.tmdb.org/t/p/w500/7vWlHtNcQnUozdzT2wvzY5VFlvE.jpg",
        cover: "https://image.tmdb.org/t/p/w780/8Tr79lfoCqH8xn1D2qD17IMEL64.jpg",
        Evaluation: 9.1,
        projectionDate: "2024-08-05",
        projectionTime: "19:30",
        dateReleased: 2023,
        Description: "Miles Morales embarks on a multiverse-spanning adventure with Spider-People from different dimensions.",
        directedBy: "Joaquim Dos Santos, Kemp Powers, Justin K. Thompson",
    },
    {
        id: 7,
        title: "The Batman",
        poster: "https://image.tmdb.org/t/p/w500/fe7Iokh7hlc7xtPBrkF1R1Us32C.jpg",
        cover: "https://image.tmdb.org/t/p/w780/90ez6ArvpO8bvpyIngBuwXOqJm5.jpg",
        Evaluation: 8.3,
        projectionDate: "2024-03-18",
        projectionTime: "20:00",
        dateReleased: 2022,
        Description: "Batman uncovers corruption in Gotham City as he confronts the enigmatic Riddler.",
        directedBy: "Matt Reeves",
    },
    {
        id: 8,
        title: "John Wick: Chapter 4",
        poster: "https://image.tmdb.org/t/p/w500/3ZtEc4v1Gu4UkR9Eo3evCrEsZ43.jpg",
        cover: "https://image.tmdb.org/t/p/w780/vx1u0uwxdlhV2MUzj4VlcMB0N6m.jpg",
        Evaluation: 8.5,
        projectionDate: "2024-05-10",
        projectionTime: "21:30",
        dateReleased: 2023,
        Description: "John Wick uncovers a path to defeating the High Table but must face his deadliest foes yet.",
        directedBy: "Chad Stahelski",
    },
];

export default moviesList;