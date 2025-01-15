import { Devvit, useAsync} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import { DataStorage } from "../util/DataStorage.js";
import { BACKGROUND_COLOR } from "../data/config.js";
import type { WinData } from "../util/DataStorage.js";

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

    //retrieve all scores by post ID. This returns an array of WinData objects
    const {data: scores, loading, error} = useAsync(async () => {
        console.log('retrieving scores')
        return await dataStorage.getScores(postId);
    },{depends: [postId]});

    //retrieve all ratings based on post ID
    const {data: rating, loading: loadingRating, error: errorRating} = useAsync(async () => {
        return await dataStorage.getRatings(postId);
    } ,{depends: [postId]});

    //retrieve average rating based on post ID
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
    
    const parsedScores = scores.map(score => ({
        ...score,
        score: Number(score.score),
        date: new Date(Number(score.date)).toLocaleString() 
    }));

    
    const winSolvers = parsedScores.filter((score: WinData) => score.score === 1);
    console.log('winSolvers', winSolvers);
    const lossSolvers = parsedScores.filter((score: WinData) => score.score === 0);
    console.log('lossSolvers', lossSolvers);
    console.log('scores', parsedScores);


    //sort winSolvers by date and take the first 5
    const firstSolvers = winSolvers
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
    

    
    return(
             <zstack height="100%" width="100%" alignment="center" backgroundColor={BACKGROUND_COLOR}>
                
      <vstack width="100%" alignment="center">
            <text weight="bold" size="xxlarge" color="Black">
                First 5 Solvers
            </text>
            <text color="Black">Number of successful solves: {winSolvers.length}</text>
            <text color="Black">People who gave up: {scores.length - winSolvers.length}</text>
            <text color="Black">Average rating of this clue: {averageRating}</text>
            <text color="Black">Out of {rating.length} ratings</text>
            


            <spacer height="20px" />
            <hstack width="100%" alignment="center">
                <text weight="bold" size="xlarge" color="Red"  width="10%">
                    Rank
                </text>
                <text weight="bold" size="xlarge" color="Red" width="30%">
                    Username
                </text>
                <text weight="bold" size="xlarge" color="Red" width="30%">
                    Guesses
                </text>
                <text weight="bold" size="xlarge" color="Red" width="30%">
                    Date and time submitted
                </text>
            </hstack>
            
            {firstSolvers && firstSolvers.map(({ username, numGuesses, date}, index) => (

                <hstack key={username} width="100%" alignment="center">
                    <text color="Black" width="10%">{index + 1}</text>
                    <text color="Black" width="30%">{username}</text>
                    <text color = "Black" width = "30%">{numGuesses}</text>
                    <text color="Black" width="30%">{date}</text>
                </hstack>
            ))} <vstack alignment="bottom">
                <spacer height="40px" />
                <button icon="back" onPress={() => setPage('Home')} appearance='media'/>
                </vstack>
            </vstack>
        </zstack>
    )
}