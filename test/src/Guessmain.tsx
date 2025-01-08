import { Devvit, useAsync, useState, useForm} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import {DataStorage} from './util/DataStorage.js';
import {ScorePage} from './Guess/ScorePage.js';
import { GuessLeaderBoard } from "./Guess/GuessLeaderBoard.js";

// note - need to add something so user can't submit multiple guess attempts. 
// immediately direct to leaderboard?

Devvit.configure({
    redditAPI: true,
});

type GuessmainProps = {
    username: string;
}

export const Guessmain = (props: GuessmainProps, context: Context): JSX.Element => {

    //get post data based on post ID. 
    //this should include clue, solution, explanation, and authorID
    const postdata = new DataStorage(context);
    const { data, loading, error } = useAsync(async () => {
        if (!context.postId) {
            throw new Error('Post ID is missing');
        }
        return await postdata.getClue(context.postId);
    });
    if (loading) {
        return (
            <blocks>
                <vstack height="100%" width="100%" alignment="center middle">
                    <text>Loading clue data...</text>
                </vstack>
            </blocks>
        );
    }
    if (error) {
        return (
            <blocks>
                <vstack height="100%" width="100%" alignment="center middle">
                    <text>Error loading clue: {error.message}</text>
                </vstack>
            </blocks>
        );
    }
    
    if (data) {
        const [clue, solution, explanation, authorId] = data;
        const [feedback, setFeedback] = useState<string>('');
        const [isGameOver, setIsGameOver] = useState<boolean>(false);
        const [score, setScore] = useState<number>(0);
        const [currentPage, setCurrentPage] = useState<string>('Guessmain');
        const [guess, setGuess] = useState<string>('');
        const [hasRevealed, setHasRevealed] = useState<boolean>(false);

        const guessForm = useForm(
            {
                fields: [
                    {
                        name: "guess",
                        label: "Enter your solution",
                        type: "string",
                    },
                ],
            },
            (values) => {
                setGuess(values.guess as string);
            }
        );

        const handleGuessSubmit = () => {
            if (guess.toLowerCase() === solution.toLowerCase()) {
                setFeedback('Correct!');
                setScore(1);
                setIsGameOver(true);
            } else {
                setFeedback('Incorrect. Try again!');
            }
        };

        if (hasRevealed){
            return(
                <blocks>
                <vstack height="100%" width="100%" alignment="center middle">
                    <text>You have already revealed the solution.</text>
                    <button onPress={() => setCurrentPage('GuessLeaderBoard')}>View Leaderboard</button>
                </vstack>
            </blocks>
            )
        }

        

        async function onFinishTurn() {
            //console.log('Finishing turn...');
            if (!context.postId) {
                throw new Error('Post ID is missing');
            }
            postdata.addGuess({
                postId: context.postId, 
                username: props.username, 
                score: score
            });
            
            context.ui.showToast("Guess saved!");
            setCurrentPage('ScorePage');
        };

        if(currentPage==='ScorePage'){
            if (!context.postId) {
                throw new Error('Post ID is missing');
            }
            return <ScorePage score={score} setPage={setCurrentPage} postId={context.postId} username={props.username}/>;
        }
        

        if (currentPage === 'GuessLeaderBoard') {
            if (!context.postId) {
                throw new Error('Post ID is missing');
            }
            return <GuessLeaderBoard setPage={setCurrentPage} postId={context.postId} username={props.username}  />;
        }

        return (
            <blocks>
                <zstack height="100%" width="100%" alignment="center middle" backgroundColor="#c0c9cc">
                    
                    <vstack height="100%" width="100%" alignment="center middle">
                        <hstack>
                            <vstack>
                            <text weight="bold" size="xxlarge" color="white">{feedback}</text>

                            <button appearance="media" maxWidth="150px" onPress={() => context.ui.showForm(guessForm)}>Enter your solution</button>
                            <text weight="bold" size="medium" color = "YellowOrange-100">{guess ? `Guess: ${guess}` : "NO GUESS YET"}</text>

                            <button onPress={handleGuessSubmit}>Check answer</button>
                            <button>Give up, reveal solution</button>
                            <text weight="bold" size='xlarge' color = "YellowOrange-100">Clue: {clue}</text>

                            </vstack>
                            <spacer width="10px"/>
                            <vstack>
                            
                                <button appearance="media" onPress={onFinishTurn}>Finish turn</button>
                            </vstack>
                        </hstack>
                        
                    </vstack>
                </zstack>
            </blocks>
        );
    }
    

    return (
        <blocks>
        <vstack height="100%" width="100%" alignment="center middle">
            <text>Guessmain</text>
            <text>{context.postId}</text>
        </vstack>
        </blocks>
    );
}