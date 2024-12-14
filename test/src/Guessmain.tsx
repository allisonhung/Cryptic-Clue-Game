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
    const handleCellClick = (index: number) => {
        setSelectedCells(prev => {
            const newSelection = prev.includes(index) 
            ? prev.filter(i => i !== index) 
            : [...prev, index];
            console.log('cell clicked', index);
            console.log('updated cells', newSelection);
            return newSelection;
    });
    };
    

    if (data) {
        const [clue, wordCount, postId, words, colors] = data;
        const onGuessHandler = (): void => {
            // Find indices of blue cells
            const blueCellIndices = colors
                .map((color, index) => color === 'AlienBlue-500' ? index : -1)
                .filter(index => index !== -1);
            
            // Sort both arrays for comparison
            const sortedSelected = [...selectedCells].sort();
            const sortedBlue = [...blueCellIndices].sort();
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
                            <text>Clue: {clue}</text>
                            <text>Word Count: {wordCount}</text>
                            </vstack>
                            <vstack>
                                <text>Words selected: {selectedCells.length}</text>
                                <button onPress={onGuessHandler}>Submit</button>
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