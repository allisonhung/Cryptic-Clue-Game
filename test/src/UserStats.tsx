import { Devvit, useAsync} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import { DataStorage } from "./util/DataStorage.js";
import { BACKGROUND_COLOR, TEXT_COLOR} from "./data/config.js";

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
        try {
            const data = await dataStorage.getUserData(username);
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
        let ratings = await Promise.all(userData.authoredPosts.map(postId => dataStorage.getRating(postId)));
        //remove NaN values
        ratings = ratings.filter(rating => !isNaN(rating));
        const totalRating = ratings.reduce((acc, rating) => acc + rating, 0);
        if (ratings.length === 0) return 0;
        return (totalRating / ratings.length).toFixed(2);
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

    return(
        <vstack backgroundColor={BACKGROUND_COLOR} height="100%" width="100%" alignment="center middle">
            <text color={TEXT_COLOR} size="xlarge">Username: {username}</text>
            <spacer size="small" />
            // Display user data
            {userData && (
                <vstack>
                    <text color={TEXT_COLOR}>Number of Clues written: {userData.authoredPosts.length}</text>
                    <text color={TEXT_COLOR}>Average rating: {averageRating}</text>
                    <text color={TEXT_COLOR}>Number of clues completed: {userData.solvedPosts.length}</text>
                    <text color={TEXT_COLOR}>Wins: {wins}</text>
                    <text color={TEXT_COLOR}>Losses: {losses}</text>
                </vstack>
            )}
            {errorUserData && <text>Error: {errorUserData.message}</text>}
            <button onPress={() => setPage("home")}>Back</button>
            
        </vstack>
    )
}