import { Devvit, useAsync, useState} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import { DataStorage } from "../util/DataStorage.js";
import { BACKGROUND_COLOR } from "../data/config.js";
import { StarRating } from "../data/stars.js";

Devvit.configure({
    redditAPI: true,
  });
interface ScorePageProps{
    setPage: (page: string) => void;
    postId: string;
    username: string;
}

export const ScorePage = ({setPage, postId, username}: ScorePageProps, context: Context): JSX.Element => {
    const dataStorage = new DataStorage(context);

    const {data: scores, loading, error} = useAsync(async () => {
        return await dataStorage.getScores(postId);
    }, {depends: [postId]});

    if (loading) {
        return <text>Loading...</text>;
    }

    const [rating, setRating] = useState<number>(0);
    
    async function addRating() {
        if (!postId) {
            throw new Error('Post ID is missing');
        }
        if (rating < 1 || rating > 5) {
            context.ui.showToast("Rating must be between 1 and 5");
            return;
        } 
        await dataStorage.addRating({postId: postId, rating: rating, userRated: username});
        context.ui.showToast("Score stored in user info");
    };

    return(
        <zstack height="100%" width="100%" alignment="center middle" backgroundColor={BACKGROUND_COLOR}>       
            <vstack alignment="center middle" width="100%">
                <text size="xxlarge" color='Black'>Rate this clue</text>
                <spacer size="small" />
                <StarRating rating={rating} onRatingSelected={setRating}/>
                <spacer size="small" />
                <text size="xlarge" color='Black'>Rating: {rating}</text>
                <spacer height="5%"/>
                <spacer size="large" />
                <hstack alignment="center middle">
                    <button icon="back" onPress={() => setPage('Home')} appearance='media'/>
                    <button onPress={addRating}>Submit rating</button>
                </hstack>
                <spacer size="small" />
                <button appearance="media" onPress={() => setPage('GuessLeaderBoard')}>Leaderboard</button>
            </vstack>
        </zstack>
    );
};