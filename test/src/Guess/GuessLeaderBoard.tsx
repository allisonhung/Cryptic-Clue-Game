import { Devvit, useAsync} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import { DataStorage } from "../util/DataStorage.js";

Devvit.configure({
    redditAPI: true,
  });

interface GuessLeaderBoardProps{
    setPage: (page: string) => void;
    postId: string;
    username: string;
}

export const GuessLeaderBoard = ({setPage, postId, username}: GuessLeaderBoardProps, context: Context): JSX.Element => {
    const dataStorage = new DataStorage(context);

    const {data: scores, loading, error} = useAsync(async () => {
        return await dataStorage.getScores(postId);
    },{depends: [postId]});

    if (loading) {
        return <text>Loading...</text>;
    }
    
    return(
        <vstack>
            <text>Leaderboard under construction</text>
            <text size="xxlarge" outline="thin" weight="bold">
                Guess Leaderboard
            </text>
            <spacer height="20px" />
            <hstack width="100%" alignment="center">
                <text size="large" outline="thin" weight="bold" width="20%">
                    Rank
                </text>
                <text size="large" outline="thin" weight="bold" width="40%">
                    Username
                </text>
                <text size="large" outline="thin" weight="bold" width="40%">
                    Score
                </text>
            </hstack>
            {scores && scores.map(({ username, score }, index) => (
                <hstack key={username} width="100%" alignment="center">
                    <text width="20%">{index + 1}</text>
                    <text width="40%">{username}</text>
                    <text width="40%">{score}</text>
                </hstack>
            ))}
            <button onPress={() => setPage('Home')}>Go back</button>
        </vstack>
    )
}