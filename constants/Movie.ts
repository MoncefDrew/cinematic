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
        title: "Inception",
        poster: "https://a.ltrbxd.com/resized/sm/upload/sv/95/s9/4j/inception-0-2000-0-3000-crop.jpg?v=30d7224316",
        cover: "https://a.ltrbxd.com/resized/sm/upload/61/5z/7p/o4/inception-0-2000-0-3000-crop.jpg?v=c6a273a35b",
        Evaluation: 8.8,
        projectionDate: "2024-12-31",
        projectionTime: "20:00",
        dateReleased: 2010,
        Description: "A skilled thief is given a chance to erase his criminal record if he successfully performs an inception.",
        directedBy: "Christopher Nolan",
    },
    {
        id: 2,
        title: "The Dark Knight",
        poster: "https://a.ltrbxd.com/resized/sm/upload/78/y5/zg/ej/oefdD26aey8GPdx7Rm45PNncJdU-0-2000-0-3000-crop.jpg?v=2d0ce4be25",
        cover: "https://a.ltrbxd.com/resized/sm/upload/z5/lx/gm/l9/the-dark-knight-0-2000-0-3000-crop.jpg?v=70012c04ba",
        Evaluation: 9.0,
        projectionDate: "2024-01-10",
        projectionTime: "19:30",
        dateReleased: 2008,
        Description: "Batman faces off against the Joker, a criminal mastermind who seeks to create chaos in Gotham.",
        directedBy: "Christopher Nolan",
    },
    {
        id: 3,
        title: "Interstellar",
        poster: "https://a.ltrbxd.com/resized/film-poster/1/1/7/6/2/1/117621-interstellar-0-2000-0-3000-crop.jpg?v=7ad89e6666",
        cover: "https://a.ltrbxd.com/resized/sm/upload/5v/xk/qh/eq/interstellar-0-2000-0-3000-crop.jpg?v=d16a4c4fa6",
        Evaluation: 8.6,
        projectionDate: "2024-02-05",
        projectionTime: "21:00",
        dateReleased: 2014,
        Description: "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
        directedBy: "Christopher Nolan",
    },
    {
        id: 4,
        title: "Dunkirk",
        poster: "https://a.ltrbxd.com/resized/sm/upload/md/nb/pu/3i/bOXBV303Fgkzn2K4FeKDc0O31q4-0-2000-0-3000-crop.jpg?v=7307b1ff5b",
        cover: "https://a.ltrbxd.com/resized/sm/upload/5t/6y/z6/j6/dunkirk-0-2000-0-3000-crop.jpg?v=5e28ec4ae1",
        Evaluation: 8.3,
        projectionDate: "2024-03-01",
        projectionTime: "18:30",
        dateReleased: 2017,
        Description: "Allied soldiers are surrounded by German forces and evacuated during a fierce battle in World War II.",
        directedBy: "Christopher Nolan",
    },
    {
        id: 5,
        title: "The Prestige",
        poster: "https://a.ltrbxd.com/resized/film-poster/5/1/1/4/7/51147-the-prestige-0-2000-0-3000-crop.jpg?v=ad7e891177",
        cover: "https://a.ltrbxd.com/resized/sm/upload/uc/nj/r1/0g/the-prestige-0-2000-0-3000-crop.jpg?v=7d36d688cb",
        Evaluation: 8.5,
        projectionDate: "2024-03-15",
        projectionTime: "20:15",
        dateReleased: 2006,
        Description: "Two magicians engage in a bitter rivalry, competing to create the ultimate illusion.",
        directedBy: "Christopher Nolan",
    },
    {
        id: 6,
        title: "Guardians of the Galaxy",
        poster: "https://a.ltrbxd.com/resized/film-poster/9/3/6/7/6/93676-guardians-of-the-galaxy-0-2000-0-3000-crop.jpg?v=3cc8cb967f",
        cover: "https://a.ltrbxd.com/resized/sm/upload/vx/d1/pg/47/guardians-of-the-galaxy-0-2000-0-3000-crop.jpg?v=7c3b7672bc",
        Evaluation: 8.0,
        projectionDate: "2024-04-05",
        projectionTime: "19:00",
        dateReleased: 2014,
        Description: "A group of misfit criminals band together to save the galaxy from an evil warlord.",
        directedBy: "James Gunn",
    },
    {
        id: 7,
        title: "Avengers: Endgame",
        poster: "https://a.ltrbxd.com/resized/film-poster/2/2/6/6/6/0/226660-avengers-endgame-0-2000-0-3000-crop.jpg?v=250ab286a3",
        cover: "https://a.ltrbxd.com/resized/sm/upload/s5/lz/yh/d2/avengers-endgame-0-2000-0-3000-crop.jpg?v=3b0a4d92ff",
        Evaluation: 8.4,
        projectionDate: "2024-05-01",
        projectionTime: "20:30",
        dateReleased: 2019,
        Description: "The Avengers assemble to defeat Thanos and undo the damage caused by the snap.",
        directedBy: "Anthony Russo, Joe Russo",
    },
    {
        id: 8,
        title: "The Matrix",
        poster: "https://a.ltrbxd.com/resized/film-poster/5/1/5/1/8/51518-the-matrix-0-2000-0-3000-crop.jpg?v=fc7c366afe",
        cover: "https://a.ltrbxd.com/resized/sm/upload/2x/uh/0t/m5/the-matrix-0-2000-0-3000-crop.jpg?v=d378a7d20e",
        Evaluation: 8.7,
        projectionDate: "2024-06-12",
        projectionTime: "22:00",
        dateReleased: 1999,
        Description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        directedBy: "Lana Wachowski, Lilly Wachowski",
    },
    {
        id: 9,
        title: "Spider-Man: No Way Home",
        poster: "https://a.ltrbxd.com/resized/film-poster/5/6/0/7/8/7/560787-spider-man-no-way-home-0-2000-0-3000-crop.jpg?v=a336d4f40c",
        cover: "https://a.ltrbxd.com/resized/sm/upload/wq/xe/cv/40/spider-man-no-way-home-0-2000-0-3000-crop.jpg?v=618a4d0a71",
        Evaluation: 7.9,
        projectionDate: "2024-07-20",
        projectionTime: "18:00",
        dateReleased: 2021,
        Description: "Spider-Man seeks help from Doctor Strange as he navigates the multiverse and fights against villains from other dimensions.",
        directedBy: "Jon Watts",
    },
    {
        id: 10,
        title: "The Lion King",
        poster: "https://a.ltrbxd.com/resized/sm/upload/lz/96/yu/mf/ztuEReeV6ofpU1HxUV9AsR6aLoe-0-2000-0-3000-crop.jpg?v=47499379fa",
        cover: "https://a.ltrbxd.com/resized/sm/upload/k5/79/pz/ox/the-lion-king-0-2000-0-3000-crop.jpg?v=45b004ac47",
        Evaluation: 8.5,
        projectionDate: "2024-08-05",
        projectionTime: "16:00",
        dateReleased: 1994,
        Description: "A lion prince flees his kingdom only to learn the true meaning of responsibility and bravery.",
        directedBy: "Roger Allers, Rob Minkoff",
    },
];
export default moviesList;