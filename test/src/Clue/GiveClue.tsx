// import statements
// Need Context and useForm for fill form
// Need useInterval to force re-render
import type { Context } from '@devvit/public-api';
import { Devvit, useState, useInterval, useForm} from "@devvit/public-api";
import {loadWords, getRandomWords, assignColors} from "../util/loadWords.js";
import { Board } from '../util/GenerateBoard.js';

Devvit.configure({
    redditAPI: true,
  });

// For page navigation
interface GiveClueProps{
    setPage: (page: string) => void;
    onNext: (clue: string, 
        wordcount: number, 
        words: string[], 
        colors: string[],
        correctCells: number[]) => void;
}



// Main function
export const GiveClue = (props: GiveClueProps, context: Context): JSX.Element => {
    // Generate and display board
    const [words, setWords] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [correctCells, setCorrectCells] = useState<number[]>([]);

    const handleCellClick = (index: number) => {
        if (colors[index] !== "AlienBlue-500") {
            return;
        }
        //console.log("Cell clicked:", index);
        setCorrectCells(prev => 
            prev.includes(index) 
            ? prev.filter(i => i !== index) 
            : [...prev, index]
        );
    };

    const fetchWordsAndColors = async () => {
        //console.log("Fetching words...");
        const allWords = await loadWords();

        const randomWords = getRandomWords(allWords, 25);
        const assignedColors = assignColors(25);
        setWords(randomWords);
        setColors(assignedColors);

        //console.log("Random words:", randomWords);
        //console.log("Assigned colors:", assignedColors);

        setDataFetched(true);
    };
    if (!dataFetched) {
        //console.log("Triggering fetchWordsAndColors on re-entry.");
        fetchWordsAndColors();
    };

    // Clue giving
    const [clue, setClue] = useState<string>("");
    //const [wordCount, setWordCount] = useState<number>(0);
    const clueForm = useForm(
        {
            fields: [
                {
                    name: "clue",
                    label: "Enter your clue",
                    type: "string",
                },
            ],
        },
        (values) => {
            setClue(values.clue as string);
        }
    );

    // Regularly force re-render every second
    const [counter, setCounter] = useState(1000);  
    const updateInterval = useInterval(() => {  
    setCounter((counter) => counter - 1);  
    }, 1000);  
    updateInterval.start();

    // main return function
    return (
        <vstack
            width="100%"
            minHeight="100%"
            alignment="middle center"
            gap="small"
            >

            <text size="xlarge">Give a clue</text>

            <hstack width="95%" alignment="center middle">
                <vstack maxWidth="20%">
                    <text>{clue ? `Clue: ${clue}` : "Clue: "}</text>
                    <text>{correctCells.length} words</text>
                    <button maxWidth="150px" onPress={() => context.ui.showForm(clueForm)}>Give Clue</button>
                    <text size = "xsmall" wrap>Give a clue.</text>
                    <text size = "xsmall" wrap>Select the corresponding blue cards and submit!</text>
                    <text size = "xsmall" wrap>Grey = bomb</text>
                    <text size = "xsmall" wrap>White = citizen</text>
                </vstack>
                <spacer width = "10px"/>
                <vstack>
                {words.length === 25 && colors.length === 25 ? (
                    //console.log("Rendering board..."),
                    <Board words={words} 
                    colors={colors}
                    onCellClick={handleCellClick}
                    selectedCells={correctCells} />
                ) : (
                    <text>Loading...</text>
                )}
                </vstack>
            </hstack>
            <hstack>
                <button onPress={() => {
                    props.setPage('Home');
                    setDataFetched(false);
                }}>Back to menu</button>
                <spacer width="10px"/>
                <button 
                    onPress={() => {
                    //setWordCount(correctCells.length);
                    props.onNext(clue, correctCells.length, words, colors, correctCells);
                    }}
                    disabled={!clue || correctCells.length===0}
                    >Submit</button>
            </hstack>
        </vstack>
    );
};

// Export page
export default GiveClue;