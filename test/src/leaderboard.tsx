import {Devvit, PostType, useAsync} from '@devvit/public-api'
import { DataStorage } from './util/DataStorage.js';
import type { Context } from '@devvit/public-api';

Devvit.configure({
    redditAPI: true,
});
type LeaderboardProps = {
    setPage: (page: string) => void;
    username: string;
};
interface Score {
    username: string;
    score: number;
}
interface PostScore{
    postId: string;
    averageScore: number;
    [key: string]: string | number;
}

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

    const {data: allUsers, loading: loadingUsers, error: errorUsers} = useAsync(async () => {
        return await dataStorage.getAllUsers();
    });

    if (loading || loadingScores || loadingUsers) {
        return <text>Loading...</text>;
    }
    console.log("postIds", postIds);
    console.log("postScores", postScores);
    console.log("allUsers", allUsers);

    if (!postIds || !postScores) {
        return <text>No posts or postscores found</text>;
    }

    const totalPosts = postIds.length;
    const totalAverageScore = postScores.reduce((acc, { averageScore }) => acc + averageScore, 0) / postScores.length;

    async function getTotalAverageScores(allUsers: string[]): Promise<{ username: string; postCount: number; totalAverageScore: number }[]> {
        return await Promise.all(
            allUsers.map(async (username) => {
                const postIds = await dataStorage.getUserPosts(username);
                if (!postIds || postIds.length === 0) {
                    return { username, postCount: 0, totalAverageScore: 0 };
                }
    
                let totalScore = 0;
                let postCount = 0;
    
                for (const postId of postIds) {
                    const scores = await dataStorage.getScores(postId);
                    if (scores && scores.length > 0) {
                        const averageScore =
                            scores.reduce((acc, score) => acc + score.score, 0) / scores.length;
                        totalScore += averageScore;
                        postCount += 1;
                    }
                }
    
                const totalAverageScore = postCount > 0 ? totalScore / postCount : 0;
                return { username, postCount, totalAverageScore };
            })
        );
    }
    
    const { data: userScores, loading: loadingUserScores, error: errorUserScores } = useAsync(async () => {
        if (!allUsers || allUsers.length === 0) return [];
        const scores = await getTotalAverageScores(allUsers);
        return scores;
    }, { depends: [allUsers] });

    if (loadingUserScores) {
        return <text>Loading user scores...</text>;
    }

    if (!userScores){
        return <text>No user scores found</text>;
    }
    const topUsers = userScores
    .sort((a, b) => b.totalAverageScore - a.totalAverageScore)
    .slice(0, 5);

    
    
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
            <vstack alignment="center" width="100%">
                <text size="xxlarge" outline="thin" weight="bold">
                    Leaderboard
                </text>
                <spacer height="20px" />
                <hstack width="100%" alignment="center">
                    <text size="large" outline="thin" weight="bold" width="20%">
                        Rank
                    </text>
                    <text size="large" outline="thin" weight="bold" width="30%">
                        Username
                    </text>
                    <text size="large" outline="thin" weight="bold" width="25%">
                        Clues
                    </text>
                    <text size="large" outline="thin" weight="bold" width="25%">
                        Avg Score
                    </text>
                </hstack>
                {topUsers.map(({ username, postCount, totalAverageScore }, index) => (
                    <hstack key={username} width="100%" alignment="center">
                        <text width="20%">{index + 1}</text>
                        <text width="30%">{username}</text>
                        <text width="25%">{postCount}</text>
                        <text width="25%">{totalAverageScore.toFixed(2)}</text>
                    </hstack>
                ))}
                <button onPress={() => setPage('Home')}>Return home</button>
            </vstack>
        </zstack>
    );
}