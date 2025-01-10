import {Devvit, PostType, useAsync} from '@devvit/public-api'
import { DataStorage } from './util/DataStorage.js';
import type { Context } from '@devvit/public-api';
import { BACKGROUND_COLOR } from './data/config.js';

Devvit.configure({
    redditAPI: true,
});
type LeaderboardProps = {
    setPage: (page: string) => void;
    username: string;
};


export const Leaderboard = ({setPage, username}: LeaderboardProps, context: Context): JSX.Element => {
    const dataStorage = new DataStorage(context);

    // Fetch all posts by the user
    const {data: postIds, loading, error} = useAsync(async () => {
        try {
            const posts = await dataStorage.getUserPosts(username);
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

    const {data: rating, loading: loadingRating, error: errorRating} = useAsync(async () => {
        if (!postIds) return [];
        const ratings = await Promise.all(postIds.map(async (postId) => {
            const ratings = await dataStorage.getRating(postId);
            return ratings;
        }));
        return ratings;
    }, {depends: [postIds]});

    const {data: allUsers, loading: loadingUsers, error: errorUsers} = useAsync(async () => {
        return await dataStorage.getAllUsers();
    });

    if (loading || loadingScores || loadingUsers || loadingRating) {
        return <text>Loading...</text>;
    }

    if (!postIds || !postScores) {
        return <text>No posts or postscores found</text>;
    }

    async function getAverageRatings(allUsers: string[]): Promise<{ username: string; postCount: number; totalAverageRating: number }[]> {
        return await Promise.all(
            allUsers.map(async (username) => {
                const postIds = await dataStorage.getUserPosts(username);
                if (!postIds || postIds.length === 0) {
                    return { username, postCount: 0, totalAverageRating: 0 };
                }

                let totalRating = 0;
                let postCount = 0;

                //for each postId, get the average rating of it. Then, take the average of all the ratings
                for (const postId of postIds) {
                    const rating = await dataStorage.getRating(postId);
                    if (rating) {
                        totalRating += rating;  
                    }
                    postCount += 1;
                }

                const totalAverageRating = postCount > 0 ? totalRating / postCount : 0;
                return { username, postCount, totalAverageRating };
            })
        );
    }
    
    const { data: userRating, loading: loadingUserRating, error: errorUserRating} = useAsync(async () => {
        if (!allUsers || allUsers.length === 0) return [];
        const scores = await getAverageRatings(allUsers);
        return scores;
    }, { depends: [allUsers] });

    if (loadingUserRating) {
        return <text>Loading user scores...</text>;
    }

    if (!userRating){
        return <text>No user scores found</text>;
    }
    const topUsers = userRating
    .sort((a, b) => b.totalAverageRating - a.totalAverageRating)
    .slice(0, 5);

    
    return (
        <zstack height="100%" width="100%" alignment="center" backgroundColor={BACKGROUND_COLOR}>
            
            <vstack alignment="center" width="100%">
                <text weight="bold" size="xxlarge" color='Black'>
                    Highest rated setters
                </text>
                <spacer height="20px" />
                <hstack width="100%" alignment="center">
                <spacer height="20px" />
                    <text weight="bold" size="large" color='Red' width="20%">
                        Rank
                    </text>
                    <text weight="bold" size="large" color='Red' width="30%">
                        Username
                    </text>
                    <text weight="bold" size="large" color='Red' width="25%">
                        Number of Clues
                    </text>
                    <text weight="bold" size="large"color='Red' width="25%">
                        Avg Rating
                    </text>
                </hstack>
                {topUsers.map(({ username, postCount, totalAverageRating }, index) => (
                    <hstack key={username} width="100%" alignment="center">
                        <spacer height="20px" />
                        <text color='Black' width="20%">{index + 1}</text>
                        <text color='Black' width="30%">{username}</text>
                        <text color='Black' width="25%">{postCount}</text>
                        <text color='Black' width="25%">{totalAverageRating.toFixed(2)}</text>
                    </hstack>
                ))}
                <spacer height="40px" />
                <button icon="home" onPress={() => setPage('Home')} appearance='media'/>
            </vstack>
        </zstack>
    );
}