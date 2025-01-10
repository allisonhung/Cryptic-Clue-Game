import { Devvit, useAsync} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import { DataStorage } from "./util/DataStorage.js";

Devvit.configure({
    redditAPI: true,
});

type UserStatsProps = {
    setPage: (page: string) => void;
    username: string;
};
export const UserStats = ({setPage, username}: UserStatsProps, context: Context): JSX.Element => {
    const dataStorage = new DataStorage(context);

    const {data: userData, loading:loadingUserData, error:errorUserData} = useAsync(async () => {
        console.log("Fetching user data");
        try {
            const data = await dataStorage.getUserData(username);
            console.log("Fetched data:", data);
            return data;
        } catch (err) {
            console.error("Error fetching posts:", err);
            throw err;
        }
    }, {depends: [username]});


    if (loadingUserData) {
        return <text>Loading...</text>;
    }

    // Get average rating for each of the user's authored posts
    const { data: averageRating, loading: loadingAverageRating, error: errorAverageRating } = useAsync(async () => {
        if (!userData?.authoredPosts) return 0;
        const ratings = await Promise.all(userData.authoredPosts.map(postId => dataStorage.getRating(postId)));
        const totalRating = ratings.reduce((acc, rating) => acc + rating, 0);
        return totalRating / ratings.length;
     });
    
    if (loadingAverageRating) {
        return <text>Loading...</text>;
    }

    // Calculate wins and losses
    const { wins, losses } = userData?.points.reduce(
        (acc, point) => {
            if (point === 1) {
                acc.wins += 1;
            } else if (point === 0) {
                acc.losses += 1;
            }
            return acc;
        },
        { wins: 0, losses: 0 }
    ) || { wins: 0, losses: 0 };
    console.log(userData?.points);

    return(
        <vstack>
            <text>{username}</text>
            // Display user data
            {userData && (
                <vstack>
                    <text>Number of Clues written: {userData.authoredPosts.length}</text>
                    <text>Average rating: {averageRating}</text>
                    <text>Number of clues completed: {userData.solvedPosts.length}</text>
                    <text>Wins: {wins}</text>
                    <text>Losses: {losses}</text>
                </vstack>
            )}
            {errorUserData && <text>Error: {errorUserData.message}</text>}
            <button onPress={() => setPage("home")}>Back</button>
            
        </vstack>
    )
}