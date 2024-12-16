import { Devvit } from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import { DataStorage } from "../util/DataStorage.js";

Devvit.configure({
    redditAPI: true,
  });

interface GuessLeaderBoardProps{
    setPage: (page: string) => void;
    username: string;
}

export const GuessLeaderBoard = ({setPage, username}: GuessLeaderBoardProps, context: Context): JSX.Element => {
    return(
        <vstack>
            <text>Leaderboard under construction</text>
            <button onPress={() => setPage('Home')}>Go back</button>
        </vstack>
    )
}