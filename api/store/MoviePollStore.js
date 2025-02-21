// MoviePollStore.js
import { create } from 'zustand';
import { supabase } from '@/lib/supabase.ts';

export const useMoviePollStore = create((set, get) => ({
    polls: [],
    loading: false,
    error: null,

    fetchPolls: async (user) => { // Accept `user` as an argument
        set({ loading: true, error: null });
        try {
            const { data: sondages, error: sondageError } = await supabase
                .from('sondage')
                .select('*, sondage_films(film_id)')
                .eq('is_active', true);

            if (sondageError) throw sondageError;

            const enhancedPolls = await Promise.all(sondages.map(async (sondage) => {
                const filmIds = sondage.sondage_films.map(sf => sf.film_id);

                const { data: films, error: filmsError } = await supabase
                    .from('film')
                    .select('*')
                    .in('film_id', filmIds);

                if (filmsError) throw filmsError;

                const { data: votes, error: votesError } = await supabase
                    .from('vote')
                    .select('film_id, vote_value, user_id')
                    .eq('sondage_id', sondage.id);

                if (votesError) throw votesError;

                const voteCountsByFilm = {};
                votes.forEach(vote => {
                    voteCountsByFilm[vote.film_id] = (voteCountsByFilm[vote.film_id] || 0) + (vote.vote_value || 1);
                });

                let userVoted = null;
                if (user) { // Use the `user` passed as an argument
                    const userVote = votes.find(vote => vote.user_id === user.id);
                    if (userVote) userVoted = userVote.film_id;
                }

                const totalVotes = Object.values(voteCountsByFilm).reduce((sum, count) => sum + count, 0);

                const moviesWithVotes = films.map(film => ({
                    ...film,
                    votes: voteCountsByFilm[film.film_id] || 0,
                    votePercentage: totalVotes > 0
                        ? ((voteCountsByFilm[film.film_id] || 0) / totalVotes * 100).toFixed(1)
                        : 0
                }));

                return {
                    ...sondage,
                    id: sondage.id,
                    movies: moviesWithVotes,
                    totalVotes,
                    userVoted
                };
            }));

            set({ polls: enhancedPolls, loading: false });
        } catch (error) {
            console.error('Error fetching polls:', error);
            set({ error: 'Failed to load movie polls', loading: false });
        }
    },

    fetchThisWeekPolls: async (user) => { // Accept `user` as an argument
        set({ loading: true, error: null });
        try {
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            const { data: sondages, error: sondageError } = await supabase
                .from('sondage')
                .select('*, sondage_films(film_id)')
                .gte('ProjectionDate', startOfWeek.toISOString())
                .lte('ProjectionDate', endOfWeek.toISOString())
                .order('ProjectionDate', { ascending: true });

            if (sondageError) throw sondageError;

            const enhancedPolls = await Promise.all(sondages.map(async (sondage) => {
                const filmIds = sondage.sondage_films.map(sf => sf.film_id);

                const { data: films, error: filmsError } = await supabase
                    .from('film')
                    .select('*')
                    .in('film_id', filmIds);

                if (filmsError) throw filmsError;

                const { data: votes, error: votesError } = await supabase
                    .from('vote')
                    .select('film_id, vote_value, user_id')
                    .eq('sondage_id', sondage.id);

                if (votesError) throw votesError;

                const voteCountsByFilm = {};
                votes.forEach(vote => {
                    voteCountsByFilm[vote.film_id] = (voteCountsByFilm[vote.film_id] || 0) + (vote.vote_value || 1);
                });

                let userVoted = null;
                if (user) { // Use the `user` passed as an argument
                    const userVote = votes.find(vote => vote.user_id === user.id);
                    if (userVote) userVoted = userVote.film_id;
                }

                const totalVotes = Object.values(voteCountsByFilm).reduce((sum, count) => sum + count, 0);

                const moviesWithVotes = films.map(film => ({
                    ...film,
                    votes: voteCountsByFilm[film.film_id] || 0,
                    votePercentage: totalVotes > 0
                        ? ((voteCountsByFilm[film.film_id] || 0) / totalVotes * 100).toFixed(1)
                        : 0
                }));

                return {
                    ...sondage,
                    id: sondage.id,
                    movies: moviesWithVotes,
                    totalVotes,
                    userVoted
                };
            }));

            set({ polls: enhancedPolls, loading: false });
        } catch (error) {
            console.error('Error fetching this week\'s polls:', error);
            set({ error: 'Failed to load this week\'s movie polls', loading: false });
        }
    },

    fetchPollById: async (pollId, user) => { // Accept `user` as an argument
        set({ loading: true, error: null });
        try {
            const { data: sondage, error: sondageError } = await supabase
                .from('sondage')
                .select('*, sondage_films(film_id)')
                .eq('id', pollId)
                .single();

            if (sondageError) throw sondageError;

            const filmIds = sondage.sondage_films.map(sf => sf.film_id);

            const { data: films, error: filmsError } = await supabase
                .from('film')
                .select('*')
                .in('film_id', filmIds);

            if (filmsError) throw filmsError;

            const { data: votes, error: votesError } = await supabase
                .from('vote')
                .select('film_id, vote_value, user_id')
                .eq('sondage_id', sondage.id);

            if (votesError) throw votesError;

            const voteCountsByFilm = {};
            votes.forEach(vote => {
                voteCountsByFilm[vote.film_id] = (voteCountsByFilm[vote.film_id] || 0) + (vote.vote_value || 1);
            });

            let userVoted = null;
            if (user) { // Use the `user` passed as an argument
                const userVote = votes.find(vote => vote.user_id === user.id);
                if (userVote) userVoted = userVote.film_id;
            }

            const totalVotes = Object.values(voteCountsByFilm).reduce((sum, count) => sum + count, 0);

            const moviesWithVotes = films.map(film => ({
                ...film,
                votes: voteCountsByFilm[film.film_id] || 0,
                votePercentage: totalVotes > 0
                    ? ((voteCountsByFilm[film.film_id] || 0) / totalVotes * 100).toFixed(1)
                    : 0
            }));

            const enhancedPoll = {
                ...sondage,
                id: sondage.id,
                movies: moviesWithVotes,
                totalVotes,
                userVoted
            };

            set({ polls: [enhancedPoll], loading: false });
            return enhancedPoll;
        } catch (error) {
            console.error('Error fetching poll by ID:', error);
            set({ error: 'Failed to load movie poll', loading: false });
            return null;
        }
    },

    submitVote: async (pollId, filmId, user) => { // Accept `user` as an argument
        if (!user) {
            set({ error: 'You must be logged in to vote' });
            return;
        }

        try {
            const { data: existingVote, error: existingVoteError } = await supabase
                .from('vote')
                .select('vote_id, film_id')
                .eq('sondage_id', pollId)
                .eq('user_id', user.user_id)
                .maybeSingle();

            if (existingVoteError) throw existingVoteError;

            if (existingVote) {
                if (existingVote.film_id === filmId) return;

                await supabase
                    .from('vote')
                    .delete()
                    .eq('vote_id', existingVote.vote_id);
            }

            const { error: voteError } = await supabase
                .from('vote')
                .insert({
                    sondage_id: pollId,
                    film_id: filmId,
                    user_id: user.user_id,
                    vote_value: 1
                });

            if (voteError) throw voteError;

            const polls = get().polls.map(poll => {
                if (poll.id === pollId) {
                    const updatedMovies = poll.movies.map(movie => {
                        if (movie.film_id === filmId) return { ...movie, votes: movie.votes + 1 };
                        if (existingVote && movie.film_id === existingVote.film_id) return { ...movie, votes: Math.max(0, movie.votes - 1) };
                        return movie;
                    });

                    const newTotalVotes = updatedMovies.reduce((sum, movie) => sum + movie.votes, 0);

                    updatedMovies.forEach(movie => {
                        movie.votePercentage = newTotalVotes > 0
                            ? ((movie.votes / newTotalVotes) * 100).toFixed(1)
                            : 0;
                    });

                    return {
                        ...poll,
                        movies: updatedMovies,
                        totalVotes: newTotalVotes,
                        userVoted: filmId
                    };
                }
                return poll;
            });

            set({ polls });
            await get().fetchPolls();
        } catch (error) {
            console.error('Error submitting vote:', error);
            set({ error: 'Failed to submit vote' });
        }
    }
}));