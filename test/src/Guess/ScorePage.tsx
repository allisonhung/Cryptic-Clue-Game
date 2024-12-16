import { Devvit, useAsync} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import { DataStorage } from "../util/DataStorage.js";
import {GuessLeaderBoard} from './GuessLeaderBoard.js';

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
        <vstack height="100%" width="100%">
            <text size="xxlarge">Your username: {username}</text>
            <text size="xxlarge">Your Score: {score}</text>
            <button onPress={() => setPage('Home')}>Go back</button>
            <button onPress={() => setPage('GuessLeaderBoard')}>Leaderboard</button>
            {scores && scores.map((scoreEntry: {username: string, score: number}) => (
                <text key={scoreEntry.username}>{scoreEntry.username}: {scoreEntry.score}</text>
            ))}
        </vstack>
    );
};