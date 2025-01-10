import { Devvit, useAsync} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import { DataStorage } from "../util/DataStorage.js";
import { BACKGROUND_COLOR } from "../data/config.js";

//leaderboard should show first 5 people to guess correctly

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

    const {data: rating, loading: loadingRating, error: errorRating} = useAsync(async () => {
        return await dataStorage.getRatings(postId);
    } ,{depends: [postId]});

    const {data: averageRating, loading: loadingAverageRating, error: errorAverageRating} = useAsync(async () => {
        return await dataStorage.getRating(postId);
    },{depends: [postId]});


    if (loading || loadingRating || loadingAverageRating) {
        return <text>Loading...</text>;
    }
    if (!scores) {
        return <text>No scores found</text>;}
    if (!rating) {
        return <text>No ratings found</text>;}


    //get the first 5 users who have a score of 1 and save them as firstSolvers
    const firstSolvers = scores.filter((score) => score.score === 1).slice(0, 5);


    //sum up all the scores
    const totalScore = scores.reduce((acc, curr) => acc + curr.score, 0);
    
    return(
             <zstack height="100%" width="100%" alignment="center" backgroundColor={BACKGROUND_COLOR}>
                
      <vstack width="100%" alignment="center">
            <text weight="bold" size="xxlarge" color="Black">
                First 5 Solvers
            </text>
            <text color="Black">Number of successful solves: {totalScore}</text>
            <text color="Black">People who gave up: {scores.length - totalScore}</text>
            <text color="Black">Average rating of this clue: {averageRating}</text>
            <text color="Black">Out of {rating.length} ratings</text>
            


            <spacer height="20px" />
            <hstack width="100%" alignment="center">
                <text weight="bold" size="xlarge" color="Red"  width="40%">
                    Rank
                </text>
                <text weight="bold" size="xlarge" color="Red" width="40%">
                    Username
                </text>
                
            </hstack>
            
            {firstSolvers && firstSolvers.map(({ username, score }, index) => (

                <hstack key={username} width="100%" alignment="center">
                    <spacer width="20%" />
                    <text color="Black" width="40%">{index + 1}</text>
                    <text color="Black" width="40%">{username}</text>
                </hstack>
            ))} <vstack alignment="bottom">
                <spacer height="40px" />
                <button icon="back" onPress={() => setPage('Home')} appearance='media'/>
                </vstack>
            </vstack>
        </zstack>
    )
}