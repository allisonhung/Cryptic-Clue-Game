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
                    <text>Guess the Words!</text>
                    <text>Clue: {clue}</text>
                    <text>Word Count: {wordCount}</text>
                    <text>Post ID: {postId}</text>
                    <Board 
                    words={words} 
                    colors={colors}
                    isGuessMode={true}
                    onCellClick={handleCellClick}
                    selectedCells={selectedCells} />
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