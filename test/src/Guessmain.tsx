//devvit functionality
import { Devvit, useAsync, useState, useForm} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";

//redis functions
import {DataStorage} from './util/DataStorage.js';

//different pages
import {ScorePage} from './Guess/ScorePage.js';
import { GuessLeaderBoard } from "./Guess/GuessLeaderBoard.js";

//different components
import { StyledButton } from "./data/styledButton.js";
import { StyledSolution } from "./data/styledSolution.js";
import { BACKGROUND_COLOR, TEXT_COLOR } from "./data/config.js";

Devvit.configure({
    redditAPI: true,
});

type GuessmainProps = {
    username: string;
}

export const Guessmain = (props: GuessmainProps, context: Context): JSX.Element => {
    //get app width (used for the styledSolution component)
    const appWidth = context.dimensions?.width ?? 700;

    //get post data based on post ID. 
    //this should include clue, solution, explanation, and authorID
    const postdata = new DataStorage(context);
    const { data, loading, error } = useAsync(async () => {
        if (!context.postId) {
            throw new Error('Post ID is missing');
        }
        return await postdata.getClue(context.postId);
    });

    //check if the user has already solved the clue
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

    //check if the user has already gotten a hint, and return the hiddenLetters if so
    const { data: hint, loading: loadingHint, error: errorHint } = useAsync(async () => {
        if (!context.postId) {
            throw new Error('Post ID is missing');
        }
        //if the user is not logged in, return false
        if (!props.username) {
            return false;
        }
        return await postdata.getClueUser({postId: context.postId, username: props.username});
    });

    

    if (loading || loadingSolved || loadingHint) {
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
        const [currentPage, setCurrentPage] = useState<string>('Guessmain');
        const [clue, solution, explanation, authorId,scores] = data;

        //feedback that will display to the user
        const [feedback, setFeedback] = useState<string>('');
        const [color, setColor] = useState<string>('Red');

        //tracker for guesses, revealed, and hints
        const [guess, setGuess] = useState<string>('');
        const [hasRevealed, setHasRevealed] = useState<boolean>(false);
        const [guesses, setGuesses] = useState<number>(0);
        const [confirmation, setConfirmation] = useState<boolean>(false);
        const [letterConfirmation, setLetterConfirmation] = useState<boolean>(false);

        //hidden letters is an array that corresponds to the solution letters that are hidden.
        //It starts with all letters hidden, and as the user reveals letters, they are removed from the array.
        
        const [hiddenLetters, setHiddenLetters] = useState<number[]>(
            hint ? hint : Array.from({length: solution.length}, (_, i) => i)
        );

        console.log("hiddenLetters: ", hiddenLetters);
        //calculate the number of users that have solved
        const numberSolved = scores.filter((score: number) => score === 1).length;

        //check if userID matches authorID. If so, set isAuthor to true
        const isAuthor = props.username === authorId ? true : false;

        //need a function here to check if the user has already revealed some letters.

        //form for user to input their guess
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
                //check if the length of the guess is the same as the solution
                if ((values.guess as string).length !== solution.length) {
                    setFeedback(`Your guess must be ${solution.length} letters long.`);
                    context.ui.showToast("Your guess must be the same length as the solution.");
                    return;
                }
                setGuess((values.guess as string).replace(/\s+/g, ''));
            }
        );

        const handleGuessSubmit = () => {
            console.log("guess submitted");
            console.log("guess: ", guess);
            console.log("solution: ", solution);
            if (guess.toLowerCase() === solution.toLowerCase()) {
                console.log("correct guess");
                setFeedback('Correct!');
                
                setColor('Green');
                if (hiddenLetters.length === solution.length && !hint) {
                    console.log("score saved as 1");
                    onFinishTurn(1);
                }
                else{
                    console.log("score saved as 0.5");
                    console.log("hint: ", hint);
                    onFinishTurn(0.5);
                }
                setHasRevealed(true);
            } else {
                setGuesses(guesses + 1);
                setColor('Red');
                setFeedback('Incorrect. Try again!');
            }
        };

        const handleReset = () => {
            console.log("resetting");
            setGuess('');
        };

        const handleReveal = () => {
            setFeedback(`The solution was: ${solution}`);
            onFinishTurn(0);
            setHasRevealed(true);
        };

        const letterPreReveal = () => {
            setLetterConfirmation(true);
        }
        const revealLetter = () => {
            setLetterConfirmation(false);
            setGuess('');
            //if hiddenLetters only has one letter left, reveal the solution
            if (hiddenLetters.length === 1) {
                setFeedback(`The solution was: ${solution}`);
                onFinishTurn(0);
                setHasRevealed(true);
                return;
            }

            if (!context.postId) {
                throw new Error('Post ID is missing');
            }
            //store user in a list of people that have gotten hints
            console.log("adding user and hiddenLetters to clueUser");
            postdata.addClueUser({postId: context.postId, username: props.username, hiddenLetters: hiddenLetters});


            //select a random letter from hiddenLetters and remove it
            setHiddenLetters((prev) => {
                const randomIndex = Math.floor(Math.random() * prev.length);
                const newHiddenLetters = [...prev];
                newHiddenLetters.splice(randomIndex, 1);
                return newHiddenLetters;
            });
            console.log("new hiddenLetters: ", hiddenLetters);
            
        }
        const preReveal = () => {
            setConfirmation(true);
        };

        

        async function onFinishTurn(score: number) {
            if (!context.postId) {
                throw new Error('Post ID is missing');
            }
            //console.log("guess recorded, with number of guesses" + guesses);

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
                        <text wrap color = {TEXT_COLOR}>Enter your solution</text>
                        <spacer size="xsmall" />
                        
                        {guess? (
                            <StyledSolution onPress={() => context.ui.showForm(guessForm)} label={guess} width={appWidth}/>
                        ): (
                            <StyledSolution onPress={() => context.ui.showForm(guessForm)} label={solution} width={appWidth} hiddenLetters={hiddenLetters}/>
                        )}

                        <spacer size="small" />
                        <hstack alignment="center middle">
                            <StyledButton
                                width="30%"
                                height="30px"
                                onPress={handleGuessSubmit}
                                label="Check answer"
                                backgroundColor="#E8B77A"
                            />
                            <spacer size="xsmall" />
                            <button icon="undo" size = "medium" appearance="media" onPress={handleReset}/>
                            
                            
                        </hstack>
                        <spacer size="xsmall" />
                        
                        <hstack alignment="center middle" width="40%">
                            <StyledButton
                                width="50%"
                                height="30px"
                                backgroundColor="#E8B77A"
                                onPress={letterPreReveal}
                                label="Reveal letter"
                            />
                            <spacer size="xsmall" />
                            <StyledButton
                                    width="50%"
                                    height="30px"
                                    backgroundColor="#E8B77A"
                                    onPress={preReveal}
                                    label="Reveal solution"
                            />
                        </hstack>
                        <spacer size = "xsmall"/>
                        <hstack alignment="center middle" width="40%">
                            {(isAuthor) && (
                                <StyledButton
                                    width="100%"
                                    height="30px"
                                    backgroundColor="Red"
                                    onPress={() => setCurrentPage('GuessLeaderBoard')}
                                    label="Leaderboard"
                                />
                            )}
                        </hstack>
                        
                        <text weight="bold" size="xxlarge" color={color}>{feedback}</text>
                        <spacer size="xsmall" />
                        <text color={TEXT_COLOR}>{numberSolved} users have solved so far.</text>
                        <spacer size="xsmall" />
                        
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
                    {letterConfirmation && (
                        <vstack
                            backgroundColor="white"
                            border="thick"
                            borderColor="black"
                            padding="medium"
                            alignment='middle center'
                            height="50%"
                            width="50%"
                        >
                            <text wrap color="Red">Are you sure you want to reveal a letter? This will remove you from the leaderboard.</text>
                            <spacer size="xsmall" />
                            <hstack alignment="center middle">
                                <StyledButton
                                    width="100%"
                                    height="100%"
                                    onPress={revealLetter}
                                    label="Yes"
                                />
                                <spacer size="small" />
                                <StyledButton
                                    width="100%"
                                    height="100%"
                                    onPress={() => setLetterConfirmation(false)}
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