import { Devvit, useState, useInterval} from "@devvit/public-api";
import {loadWords, getRandomWords, assignColors} from "../util/loadWords.js";

type PageProps = {
  setPage: (page: string) => void;
};

type BoardProps={
    words: string[];
    colors: string[];
};

// create a board of 5 by 5 
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
                    width="40px"
                    height="20px"
                    backgroundColor={colors[wordIndex]}
                >
                    <text>{words[wordIndex]}</text>
                </vstack>
            );
            wordIndex++;
        }
        rows.push(
            <hstack key={row.toString()} gap="large"> 
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

const GiveClue = ({ setPage }: PageProps) => {
    const [words, setWords] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [dataFetched, setDataFetched] = useState(false);

    const fetchWordsAndColors = async () => {
        console.log("Fetching words...");
        const allWords = await loadWords();
        console.log("All words:", allWords);
        const randomWords = getRandomWords(allWords, 25);
        console.log("Random words:", randomWords);
        setWords(randomWords);
        const assignedColors = assignColors(25);
        console.log("Assigned colors:", assignedColors);
        setColors(assignedColors);
        setDataFetched(true);
    };
    
    if (!dataFetched) {
        fetchWordsAndColors();
    };

    console.log("Words state:", words);
    console.log("Colors state:", colors);
    return (
        <vstack
            width="100%"
            height="100%"
            alignment="middle center"
            gap="large"
            backgroundColor="lightblue">
            <text size="xxlarge">Clue giving page</text>
            <hstack width="100%" height="2px" />
            {words.length === 25 && colors.length === 25 ? (
                <Board words={words} colors={colors} />
            ) : (
                <text>Loading...</text>
            )}
            <button onPress={() => {
                setPage('Home');
                setDataFetched(false);
            }}>Back to menu</button>
        </vstack>
    );
};


export default GiveClue;