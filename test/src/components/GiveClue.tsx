import { Devvit, useState, useInterval, useForm} from "@devvit/public-api";
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

const GiveClue = ({ setPage }: PageProps) => {
    const [words, setWords] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [dataFetched, setDataFetched] = useState(false);

    const [counter, setCounter] = useState(1000);  

    const updateInterval = useInterval(() => {  
    setCounter((counter) => counter - 1);  
    }, 1000);  

    updateInterval.start();

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
                    <text>clue goes here</text>
                    <button>Change name</button>
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
                    setPage('Home');
                    setDataFetched(false);
            }}>Back to menu</button>
        </vstack>
    );
};


export default GiveClue;