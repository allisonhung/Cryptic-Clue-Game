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
    if (!scores) {
        return <text>No scores found</text>;}

    const topUser = [...scores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
    
    return(
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
      <vstack width="100%" alignment="center">
            <text weight="bold" size="xxlarge" color="YellowOrange-200">
                Code Breakers: Top Score
            </text>

            <spacer height="20px" />
            <hstack width="100%" alignment="center">
                <spacer width="20%" />
                <text weight="bold" size="xlarge" color="YellowOrange-200"  width="20%">
                    Rank
                </text>
                <text weight="bold" size="xlarge" color="YellowOrange-200" width="40%">
                    Username
                </text>
                <text weight="bold" size="xlarge" color="YellowOrange-200" width="40%">
                    Score
                </text>
            </hstack>
            
            {topUser && topUser.map(({ username, score }, index) => (

                <hstack key={username} width="100%" alignment="center">
                    <spacer width="20%" />
                    <text color="white" width="20%">{index + 1}</text>
                    <text color="white" width="40%">{username}</text>
                    <text color="white" width="40%">{score}</text>
                </hstack>
            ))} <vstack alignment="bottom">
                <spacer height="40px" />
                <button icon="back" onPress={() => setPage('Home')} appearance='media'/>
                </vstack>
            </vstack>
        </zstack>
    )
}