import { Devvit, useAsync} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import { DataStorage } from "../util/DataStorage.js";
import {GuessLeaderBoard} from './GuessLeaderBoard.js';
import { BACKGROUND_COLOR } from "../data/config.js";

Devvit.configure({
    redditAPI: true,
  });
interface ScorePageProps{
    score: number;
    setPage: (page: string) => void;
    postId: string;
    username: string;
}

export const ScorePage = ({score, setPage, postId, username}: ScorePageProps, context: Context): JSX.Element => {
    const dataStorage = new DataStorage(context);

    const {data: scores, loading, error} = useAsync(async () => {
        return await dataStorage.getScores(postId);
    }, {depends: [postId]});
    
    if (loading) {
        return <text>Loading...</text>;
    }

    console.log("scores", scores);

    return(
        <zstack height="100%" width="100%" alignment="center" backgroundColor={BACKGROUND_COLOR}>
            
             <vstack alignment="center" width="100%">
            <text size="xxlarge" color='YellowOrange-200'>Your username: {username}</text>
            <spacer size="small" />
            <text size="xxlarge" color='YellowOrange-200'>Your Score: {score}</text>
            <spacer size="large" />
            <button icon="back" onPress={() => setPage('Home')} appearance='media'/>
            <spacer size="small" />
            <text>Full explanation of the clue should go here</text>
            <text>Also include an option to rate clue out of 5</text>
           
            <button appearance="media" onPress={() => setPage('GuessLeaderBoard')}>Leaderboard</button>
        </vstack>
        </zstack>
    );
};