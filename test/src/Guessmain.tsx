import { Devvit, useAsync, useState, useForm} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import {DataStorage} from './util/DataStorage.js';
import {ScorePage} from './Guess/ScorePage.js';
import { GuessLeaderBoard } from "./Guess/GuessLeaderBoard.js";
import { StyledButton } from "./data/styledButton.js";
import { StyledSolution, EmptySolution } from "./data/styledSolution.js";
import { BACKGROUND_COLOR, TEXT_COLOR } from "./data/config.js";

Devvit.configure({
    redditAPI: true,
});

type GuessmainProps = {
    username: string;
}

export const Guessmain = (props: GuessmainProps, context: Context): JSX.Element => {
    //width is 732 or 700 on laptop. 
    const appWidth = context.dimensions?.width ?? 700;
    //console.log("appWidth", appWidth);

    //get post data based on post ID. 
    //this should include clue, solution, explanation, and authorID
    const postdata = new DataStorage(context);
    const { data, loading, error } = useAsync(async () => {
        if (!context.postId) {
            throw new Error('Post ID is missing');
        }
        return await postdata.getClue(context.postId);
    });

    const { data: solved, loading: loadingSolved, error: errorSolved } = useAsync(async () => {
        if (!context.postId) {
            throw new Error('Post ID is missing');
        }
        //if the user is not logged in, return false
        if (!props.username) {
            return false;
        }
        return await postdata.hasSolved({postId: context.postId, username: props.username});
    });

    if (loading || loadingSolved) {
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
        const [color, setColor] = useState<string>('Red');
        const [currentPage, setCurrentPage] = useState<string>('Guessmain');
        const [guess, setGuess] = useState<string>('');
        const [hasRevealed, setHasRevealed] = useState<boolean>(false);
        const [guesses, setGuesses] = useState<number>(0);
        const [confirmation, setConfirmation] = useState<boolean>(false);
        //check if postid exists in user's solvedposts. If it does, set hasRevealed to true
        

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
                setGuess((values.guess as string).replace(/\s+/g, ''));
            }
        );

        const handleGuessSubmit = () => {
            if (guess.toLowerCase() === solution.toLowerCase()) {
                setFeedback('Correct!');
                setColor('Green');
                onFinishTurn(1);
                setHasRevealed(true);
            } else {
                setGuesses(guesses + 1);
                setColor('Red');
                setFeedback('Incorrect. Try again!');
            }
        };
        const handleReveal = () => {
            setFeedback(`The solution was: ${solution}`);
            onFinishTurn(0);
            setHasRevealed(true);
        };
        const preReveal = () => {
            setConfirmation(true);
        };

        

        async function onFinishTurn(score: number) {
            if (!context.postId) {
                throw new Error('Post ID is missing');
            }
            console.log("guess recorded, with number of guesses" + guesses);

            postdata.addGuess({
                postId: context.postId, 
                username: props.username, 
                score: score,
                numGuesses: guesses+1
            });
            
            context.ui.showToast("Score stored in user info");
        };

        if(currentPage==='ScorePage'){
            if (!context.postId) {
                throw new Error('Post ID is missing');
            }
            return <ScorePage setPage={setCurrentPage} postId={context.postId} username={props.username}/>;
        }
        

        if (currentPage === 'GuessLeaderBoard') {
            if (!context.postId) {
                throw new Error('Post ID is missing');
            }
            return <GuessLeaderBoard setPage={setCurrentPage} postId={context.postId} username={props.username}  />;
        }

        return (
            <blocks>
                <zstack height="100%" width="100%" alignment="center middle" backgroundColor={BACKGROUND_COLOR}>

                    <vstack height="100%" width="100%" alignment="center middle">
                        <text wrap weight="bold" size='xlarge' color = {TEXT_COLOR}>Clue: {clue}</text>
                        <StyledButton
                            width="200px"
                            height="25px"
                            onPress={() => context.ui.showForm(guessForm)}
                            label="Enter your solution"
                        />
                        <spacer size="xsmall" />
                        
                        {guess? (
                            <StyledSolution onPress={() => context.ui.showForm(guessForm)} label={guess} width={appWidth}/>
                        ): (
                            <EmptySolution onPress={() => context.ui.showForm(guessForm)} length={solution.length} width={appWidth}/>
                        )}

                        <spacer size="xsmall" />
                        <hstack alignment="center middle">
                            <StyledButton
                                width="30%"
                                height="50px"
                                onPress={handleGuessSubmit}
                                label="Check answer"
                            />
                            <spacer size="xsmall" />
                            <StyledButton
                                width="30%"
                                height="50px"
                                onPress={preReveal}
                                label="Give up, reveal solution"
                            />
                        </hstack>
                        <text weight="bold" size="xxlarge" color={color}>{feedback}</text>
                        <spacer size="xsmall" />

                        
                        <text color={TEXT_COLOR}>Number of guesses: {guesses}</text>
                        
                    </vstack>
                    {confirmation && (
                        <vstack
                            backgroundColor="white"
                            border="thick"
                            borderColor="black"
                            padding="medium"
                            alignment='middle center'
                            height="50%"
                            width="50%"
                        >
                            <text wrap color="Red">Are you sure you want to reveal the solution?</text>
                            <spacer size="xsmall" />
                            <hstack alignment="center middle">
                                <StyledButton
                                    width="100%"
                                    height="100%"
                                    onPress={handleReveal}
                                    label="Yes"
                                />
                                <spacer size="small" />
                                <StyledButton
                                    width="100%"
                                    height="100%"
                                    onPress={() => setConfirmation(false)}
                                    label="No"
                                />
                            </hstack>
                        </vstack>
                    )}
                    {(hasRevealed || solved) && (
                        <vstack 
                            backgroundColor="white" 
                            border="thick" 
                            borderColor="black" 
                            padding="medium"
                            alignment='middle center'
                            height="80%"
                            width="90%"
                        >                            
                            <text color={color}>{solved ? "You have already solved this clue": feedback}</text>
                            <StyledSolution label={solution} width={appWidth * 0.8}/>
                            <spacer size="xsmall" />
                            <text color={TEXT_COLOR}>Clue setter: {authorId}</text>
                            <spacer size="xsmall" />
                            <text color={TEXT_COLOR} wrap overflow="ellipsis">Explanation: {explanation}</text>
                            <spacer size="xsmall" />
                            <StyledButton
                                width="200px"
                                height="40px"
                                onPress={() => setCurrentPage('GuessLeaderBoard')}
                                label="View Leaderboard"
                            />
                            <spacer size="xsmall" />
                            <StyledButton
                                width="200px"
                                height="40px"
                                onPress={() => setCurrentPage('ScorePage')}
                                label="Rate this clue"
                            />
                        </vstack>
                    )}
                    
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