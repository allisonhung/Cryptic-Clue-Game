import { Devvit, useAsync, useState} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import { DataStorage } from "../util/DataStorage.js";
import { BACKGROUND_COLOR, TEXT_COLOR} from "../data/config.js";
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
        //console.log('retrieving scores')
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


    //sort winSolvers by date and take the first 5
    const firstSolvers = winSolvers
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

    //check if user is in firstSolvers. If not, set userShow to true
    const [userShow, setUserShow] = useState<boolean>(false);
    if (!firstSolvers.find((score: WinData) => score.username === username)) {
        setUserShow(true);
        console.log('user not in first solvers');
    }
    else{
        console.log('user in first solvers');
    }

    //identify ranking, date, and numGuesses of user
    const userRanking = winSolvers.findIndex((score: WinData) => score.username === username) + 1;
    const userDate = winSolvers.find((score: WinData) => score.username === username)?.date;
    const userGuesses = winSolvers.find((score: WinData) => score.username === username)?.numGuesses;
    
    

    
    return(
        <zstack height="100%" width="100%" alignment="center" backgroundColor={BACKGROUND_COLOR}>
            <vstack width="100%" alignment="center">
                <spacer height="20px" />

                <text weight="bold" size="xxlarge" color={TEXT_COLOR}>
                    Stats
                </text>
                <text color={TEXT_COLOR}>Number of successful solves: {winSolvers.length}</text>
                <text color={TEXT_COLOR}>People who gave up: {scores.length - winSolvers.length}</text>
                <text color={TEXT_COLOR}>Average rating of this clue: {averageRating}</text>
                <text color={TEXT_COLOR}>Out of {rating.length} ratings</text>
                <spacer height="20px" />
                <text weight="bold" size="xxlarge" color={TEXT_COLOR}>
                    Fastest 5 Solvers
                </text>
                <hstack width="100%" alignment="center">
                    <text weight="bold" size="large" color="Red"  width="10%">
                        Rank
                    </text>
                    <text weight="bold" size="large" color="Red" width="30%">
                        Username
                    </text>
                    <text weight="bold" size="large" color="Red" width="30%">
                        Guesses
                    </text>
                    <text wrap weight="bold" size="large" color="Red" width="30%">
                        Date and time submitted
                    </text>
                </hstack>
            
                {firstSolvers && firstSolvers.map(({ username, numGuesses, date}, index) => (

                    <hstack key={username} width="100%" alignment="center">
                        <text color={TEXT_COLOR} width="10%">{index + 1}</text>
                        <text color={TEXT_COLOR} width="30%">{username}</text>
                        <text color = {TEXT_COLOR} width = "30%">{numGuesses}</text>
                        <text wrap color={TEXT_COLOR} width="30%">{date}</text>
                    </hstack>
                ))} 
                {userShow && (
                    <hstack width="100%" alignment="center">
                        <text color={TEXT_COLOR} width="10%">{userRanking}</text>
                        <text color={TEXT_COLOR} width="30%">{username}</text>
                        <text color={TEXT_COLOR} width="30%">{userGuesses}</text>
                        <text color={TEXT_COLOR} width="30%">{userDate}</text>
                    </hstack>
                )}
                <vstack alignment="bottom">
                    <spacer height="40px" />
                    <button icon="back" onPress={() => setPage('Home')} appearance='media'/>
                </vstack>

        </vstack>
        </zstack>
    )
}