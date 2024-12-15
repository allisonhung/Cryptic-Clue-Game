import {Devvit, PostType, useAsync} from '@devvit/public-api'
import { DataStorage } from './util/DataStorage.js';
import type { Context } from '@devvit/public-api';

type LeaderboardProps = {
    setPage: (page: string) => void;
    username: string;
};

export const Leaderboard = ({setPage, username}: LeaderboardProps, context: Context): JSX.Element => {
    console.log("username", username);
    const dataStorage = new DataStorage(context);
    const {data: postIds, loading, error} = useAsync(async () => {
        return await dataStorage.getUserPosts(username);
    }, {depends: [username]});
    console.log("postIds", postIds);

    const {data: postScores, loading: loadingScores, error: errorScores} = useAsync(async () => {
        if (!postIds) return [];
        const scores = await Promise.all(postIds.map(async (postId) => {
            const scores = await dataStorage.getScores(postId);
            const averageScore = scores.reduce((acc, score) => acc + score.score, 0) / scores.length;
            return {postId, averageScore};
        }));
        return scores;
    }, {depends: [postIds]});
    console.log("postScores", postScores);

    if (loading || loadingScores) {
        return <text>Loading...</text>;
    }
    
    
    return (
    <vstack>
        <text>Leaderboard under construction</text>
        <text>Username: {username}</text>
        <button onPress={() => setPage('Home')}>Back to menu</button>
    </vstack>
    )
};

