import { Devvit, useAsync, useState} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import {DataStorage} from './util/DataStorage.js';
import { Board } from "./util/GenerateBoard.js";
import {ScorePage} from './Guess/ScorePage.js';
import { GuessLeaderBoard } from "./Guess/GuessLeaderBoard.js";

Devvit.configure({
    redditAPI: true,
});
type GuessmainProps = {
    username: string;
}

export const Guessmain = (props: GuessmainProps, context: Context): JSX.Element => {
    const postdata = new DataStorage(context);
    //console.log('username', props.username);
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

    const [selectedCells, setSelectedCells] = useState<number[]>([]);
    
    

    if (data) {
        const [clue, wordCount, postId, words, colors, correctCells, authorId] = data;
        const [feedback, setFeedback] = useState<string>('');
        const [isGameOver, setIsGameOver] = useState<boolean>(false);
        const [score, setScore] = useState<number>(0);
        const [currentPage, setCurrentPage] = useState<string>('Guessmain');
        //console.log('authorId', authorId);
        //console.log('postId', postId);
        
        const handleCellClick = (index: number) => {
            if (isGameOver) {
                return;
            }
            setSelectedCells(prev => {
                if (!prev.includes(index) && prev.length < wordCount) {
                    const newSelection = [...prev, index];
                    const isCorrect = correctCells.includes(index);
                    const isBlue = colors[index] === 'AlienBlue-500';
                    const isGray = colors[index] === 'PureGray-500';
                    if (isCorrect){
                        setFeedback('Correct!');
                        setScore(prevScore => prevScore + 1);
                    }
                    else if (isBlue){
                        setFeedback('Incorrect - but keep guessing!');
                    }
                    else if (isGray){
                        setFeedback('Incorrect - BOMB');
                        setScore(0);
                        setIsGameOver(true);
                    }
                    else {
                        setFeedback('Incorrect; citizen card');
                        setIsGameOver(true);
                    }
                    //console.log('cell clicked', index);
                    //console.log('updated cells', newSelection);
                    return newSelection;
                }
                
                return prev;
        });
        };

        //console.log("correctCells", correctCells);

        async function onFinishTurn() {
            //console.log('Finishing turn...');
            postdata.addGuess({
                postId: postId, 
                username: props.username, 
                score: score
            });
            
            //console.log('score', score);
            //console.log('postId', postId);
            //console.log('userId', props.username);
            context.ui.showToast("Score saved!");
            setCurrentPage('ScorePage');
        };

        if(currentPage==='ScorePage'){
            return <ScorePage score={score} setPage={setCurrentPage} postId={postId} username={props.username}/>;
        }
        

        if (currentPage === 'GuessLeaderBoard') {
            return <GuessLeaderBoard setPage={setCurrentPage} username={props.username}  />;
        }

        return (
            <blocks>
                <zstack height="100%" width="100%" alignment="center middle">
                    <image
                    url="wood_background.jpg"
                    description="wooden background"
                    imageHeight={1024}
                    imageWidth={2048}
                    height="100%"
                    width="100%"
                    resizeMode="cover" />
                    <vstack height="100%" width="100%" alignment="center middle">
                        <hstack>
                            <vstack>
                            <text>{feedback}</text>
                            <text size='xlarge' color = "YellowOrange-100">Clue: {clue}</text>
                            <text size='xlarge' color = "YellowOrange-100">Guesses remaining: {wordCount - selectedCells.length}</text>
                            </vstack>
                            <spacer width="10px"/>
                            <vstack>
                                <text size='large' color = "YellowOrange-100">Score: {score}</text>
                                <button appearance="media" onPress={onFinishTurn}>Finish turn</button>
                            </vstack>
                        </hstack>
                        <Board 
                            words={words} 
                            colors={colors}
                            isGuessMode={true}
                            onCellClick={handleCellClick}
                            selectedCells={selectedCells}
                            wordCount={wordCount} />
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