import {Movie} from "@/constants/Movie";

export interface MovieVote extends Movie {
    votes: number;
}

export type MoviePoll = {
    id: number;
    title: string;
    dateCreated: Date;
    isActive: boolean;
    movies: MovieVote[];
};
