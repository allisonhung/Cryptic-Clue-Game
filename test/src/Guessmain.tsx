import { Devvit, useAsync, useState} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import {PostData} from './util/PostData.js';
import { Board } from "./util/GenerateBoard.js";

interface GuessmainProps {

}

export const Guessmain: Devvit.CustomPostComponent = (context: Context) => {
    const postdata = new PostData(context);
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
        const [clue, wordCount, postId, words, colors, correctCells] = data;
        const [feedback, setFeedback] = useState<string>('');
        const [isGameOver, setIsGameOver] = useState<boolean>(false);
        const [score, setScore] = useState<number>(0);
        
        const handleCellClick = (index: number) => {
            if (isGameOver) {
                return;
            }
            setSelectedCells(prev => {
                if (prev.includes(index)) {
                    const newSelection = prev.filter(i => i !== index);
                    console.log('cell clicked', index);
                    console.log('updated cells', newSelection);
                    return newSelection;
                }
                else if (prev.length < wordCount) {
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
                        return prev;
                    }
                    else {
                        setFeedback('Incorrect; citizen card');
                        setIsGameOver(true);
                        return prev;
                    }
                    console.log('cell clicked', index);
                    console.log('updated cells', newSelection);
                    return newSelection;
                }
                
                return prev;
        });
        };

        console.log("correctCells", correctCells);
        const onGuessHandler = (): void => {
            // Sort both arrays for comparison
            const sortedSelected = [...selectedCells].sort();
            const sortedBlue = [...correctCells].sort();
            console.log("sortedSelected", sortedSelected);
            console.log("sortedBlue", sortedBlue);
            
            // Compare lengths first
            if (sortedSelected.length !== sortedBlue.length) {
                console.log('Incorrect guess');
                return;
            }
            
            // Compare each index
            if (sortedSelected.every((value, index) => value === sortedBlue[index])){
                console.log('Correct guess');
                return;
            }
        };
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
                            <text>Clue: {clue}</text>
                            <text>Word Count: {wordCount}</text>
                            </vstack>
                            <spacer width="10px"/>
                            <vstack>
                                <text>Score: {score}</text>
                                <button onPress={onGuessHandler}>Finish turn</button>
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

    //add onGuessHandler function that compares selectedCells to correct cells
    //if correct, navigate to next page and give user one point
    // SOMETHING LIKE THIS:
    
    
    

    return (
        <blocks>
        <vstack height="100%" width="100%" alignment="center middle">
            <text>Guessmain</text>
            <text>{context.postId}</text>
        </vstack>
        </blocks>
    );
}