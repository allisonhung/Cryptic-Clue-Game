import { Devvit, useState} from "@devvit/public-api";
// To set up the board of 5 by 5
type BoardProps={
    words: string[];
    colors: string[];
    isGuessMode?: boolean;
    onCellClick?: (index: number) => void;
    selectedCells?: number[];
    wordCount?: number;
};

// Board component
export const Board = ({
    words, 
    colors, 
    isGuessMode = false, 
    onCellClick, 
    selectedCells=[],
    wordCount=0
}: BoardProps) => {
    const [lastClickTime, setLastClickTime] = useState(0);
    const DEBOUNCE_TIME = 100; // milliseconds

    const handleCellClick = (index: number) => {
        const now = Date.now();
        //console.log(wordCount)
        if (now - lastClickTime >= DEBOUNCE_TIME) {
            // If cell is already selected, allow deselection
            if (selectedCells.includes(index)) {
                onCellClick?.(index);
                setLastClickTime(now);
                return;
            }
            // If not selected, only allow selection if under wordCount limit
            if (wordCount === 0 || selectedCells.length < wordCount) {
                onCellClick?.(index);
                setLastClickTime(now);
            }
        }
    };


    const rows: JSX.Element[] = [];
    let wordIndex=0;
    for (let row = 0; row < 5; ++row) {
        const cells: JSX.Element[] = [];
        for (let col = 0; col < 5; ++col) {
            const currentIndex = wordIndex;
            const backgroundColor = isGuessMode 
                ? selectedCells.includes(currentIndex) 
                    ? colors[currentIndex] 
                    : "white"
                : colors[currentIndex];
            cells.push(
                <vstack
                    key={`${row}-${col}`} 
                    border="thick"
                    borderColor = {selectedCells.includes(currentIndex) ? "Yellow-200" : "neutral-border-weak"}
                    alignment={"middle center"}
                    cornerRadius={"small"}
                    width="80px"
                    height="30px"
                    backgroundColor={backgroundColor}
                    onPress={() => handleCellClick(currentIndex)}
                >
                    <text 
                    color="black" 
                    outline="thin"
                    weight = "bold"
                    >
                        {words[wordIndex]}
                    </text>
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