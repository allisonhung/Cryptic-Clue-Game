// import statements
// Need Context and useForm for fill form
// Need useInterval to force re-render
import type { Context } from '@devvit/public-api';
import { Devvit, useState, useInterval, useForm} from "@devvit/public-api";
import {loadWords, getRandomWords, assignColors} from "../util/loadWords.js";

// I think we'll need this for creating a new post but idk yet
Devvit.configure({
    redditAPI: true,
  });

// For page navigation
interface GiveClueProps{
    setPage: (page: string) => void;
    onNext: (clue: string, wordcount: number) => void;
}

// To set up the board of 5 by 5
type BoardProps={
    words: string[];
    colors: string[];
};
export const Board = ({words, colors}: BoardProps) => {
    const rows: JSX.Element[] = [];
    let wordIndex=0;
    for (let row = 0; row < 5; ++row) {
        const cells: JSX.Element[] = [];
        for (let col = 0; col < 5; ++col) {
            cells.push(
                <vstack
                    key={`${row}-${col}`} 
                    border={"thick"}
                    alignment={"middle center"}
                    cornerRadius={"small"}
                    width="80px"
                    height="30px"
                    backgroundColor={colors[wordIndex]}
                >
                    <text>{words[wordIndex]}</text>
                </vstack>
            );
            wordIndex++;
        }
        rows.push(
            <hstack key={row.toString()} gap="small"> 
                {cells}
            </hstack>
        );
    }
    return (
        <vstack gap="small" alignment="center middle">
            {rows}
        </vstack>
    );
};

// Main function
export const GiveClue = (props: GiveClueProps, context: Context): JSX.Element => {
    // Generate and display board
    const [words, setWords] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [dataFetched, setDataFetched] = useState(false);
    const fetchWordsAndColors = async () => {
        console.log("Fetching words...");
        const allWords = await loadWords();

        const randomWords = getRandomWords(allWords, 25);
        const assignedColors = assignColors(25);
        setWords(randomWords);
        setColors(assignedColors);

        console.log("Random words:", randomWords);
        console.log("Assigned colors:", assignedColors);

        setDataFetched(true);
    };
    if (!dataFetched) {
        console.log("Triggering fetchWordsAndColors on re-entry.");
        fetchWordsAndColors();
    };

    // Clue giving
    const [clue, setClue] = useState<string>("");
    const [wordCount, setWordCount] = useState<number>(0);
    const clueForm = useForm(
        {
            fields: [
                {
                    name: "clue",
                    label: "Enter your clue",
                    type: "string",
                },
                {
                    name: "wordCount",
                    label: "Number of words",
                    type: "number",
                },
            ],
        },
        (values) => {
            setClue(values.clue as string);
            setWordCount(values.wordCount as number);
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
            height="100%"
            alignment="middle center"
            gap="small"
            backgroundColor="lightblue">

            <text size="xlarge">Clue giving page</text>
            <hstack>
                <vstack>
                    <text>{clue ? `${clue}: ${wordCount} words` : "No clue given yet"}</text>
                    <button onPress={() => context.ui.showForm(clueForm)}>Give Clue</button>
                </vstack>
                console.log("Words:", words);
                console.log("Colors state:", colors);
                {words.length === 25 && colors.length === 25 ? (
                    //console.log("Rendering board..."),
                    <Board words={words} colors={colors} />
                ) : (
                    <text>Loading...</text>
                )}
            </hstack>
                <button onPress={() => {
                    props.setPage('Home');
                    setDataFetched(false);
                }}>Back to menu</button>
                <button 
                    onPress={() => {
                    console.log(clue);
                    console.log(wordCount);
                    console.log("onNext type:", typeof props.onNext);
                    props.onNext(clue, wordCount);
                    }}
                    disabled={!clue || wordCount===0}
                    >Submit</button>
        </vstack>
    );
};

// Export page
export default GiveClue;