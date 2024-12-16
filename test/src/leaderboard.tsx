import {Devvit, PostType, useAsync} from '@devvit/public-api'
import { DataStorage } from './util/DataStorage.js';
import type { Context } from '@devvit/public-api';


type LeaderboardProps = {
    setPage: (page: string) => void;
    username: string;
};

export const Leaderboard = ({setPage, username}: LeaderboardProps, context: Context): JSX.Element => {
    console.log("Rendering Leaderboard component");
    const dataStorage = new DataStorage(context);

    const {data: postIds, loading, error} = useAsync(async () => {
        console.log("Fetching user posts");
        try {
            const posts = await dataStorage.getUserPosts(username);
            console.log("Fetched posts:", posts);
            return posts;
        } catch (err) {
            console.error("Error fetching posts:", err);
            throw err;
        }
    }, {depends: [username]});

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
    const getPlayerStats = (scores) => {
        if (!scores || scores.length === 0) return null;
        
        const totalClues = scores.length;
        const averageScore = scores.reduce((acc, score) => acc + score.score, 0) / totalClues;
        
        return {
            totalClues,
            averageScore
        };
    };  

    
    
    return (
        <zstack height="100%" width="100%" alignment="center">
            <image
                url="wood_background.jpg"
                description="wooden background"
                imageHeight={1024}
                imageWidth={2048}
                height="100%"
                width="100%"
                resizeMode="cover"
            />
            <hstack alignment='center'> 
                <vstack width="100%" alignment="center">
                    <hstack>
                        <text size="xxlarge" outline="thin" weight="bold">
                            Leaderboard
                        </text>
                    </hstack>
                    <spacer width="20px" />
                    <hstack width="100%">
                        <text size="large" outline="thin" weight="bold">
                            Rank
                        </text>
                        <spacer width="5px" />
                        <text size="large" outline="thin" weight="bold">
                            Username
                        </text>
                        <spacer width="5px" />
                        <text size="large" outline="thin" weight="bold">
                            Clues
                        </text>
                        <spacer width="5px" />
                        <text size="large" outline="thin" weight="bold">
                            Avg Score
                        </text>
                        </hstack>
                <spacer width="20px" />
                <vstack width="100%">
                    {postScores &&
                        postScores
                            .sort((a, b) => b.averageScore - a.averageScore)
                            .slice(0, 5)
                            .map((score, index) => {
                                const stats = getPlayerStats(score);
                                return (
                                    <hstack key={score.postId || String(index)}>
                                        <text>{index + 1}</text>
                                        <spacer width="5px" />
                                        <text>{username}</text>
                                        <spacer width="5px" />
                                        <text>{stats?.totalClues || 0}</text>
                                        <spacer width="5px" />
                                        <text>{stats?.averageScore.toFixed(1) || '0.0'}</text>
                                    </hstack>
                                );
                            })}
                </vstack>
            </vstack>
        </hstack>
    </zstack>
);
}