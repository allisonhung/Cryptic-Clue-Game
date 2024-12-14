import { Devvit, useState} from "@devvit/public-api";
// To set up the board of 5 by 5
type BoardProps={
    words: string[];
    colors: string[];
    isGuessMode?: boolean;
    onCellClick?: (index: number) => void;
    selectedCells?: number[];
};

// Board component
export const Board = ({words, colors, isGuessMode = false, onCellClick, selectedCells=[]}: BoardProps) => {
    const [lastClickTime, setLastClickTime] = useState(0);
    const DEBOUNCE_TIME = 100; // milliseconds

    const handleCellClick = (index: number) => {
        const now = Date.now();
        if (now - lastClickTime >= DEBOUNCE_TIME) {
            onCellClick?.(index);
            setLastClickTime(now);
        }
    };


    const rows: JSX.Element[] = [];
    let wordIndex=0;
    console.log("board selectedCells:", selectedCells);
    for (let row = 0; row < 5; ++row) {
        const cells: JSX.Element[] = [];
        for (let col = 0; col < 5; ++col) {
            const currentIndex = wordIndex;
            cells.push(
                <vstack
                    key={`${row}-${col}`} 
                    border="thick"
                    borderColor = {selectedCells.includes(currentIndex) ? "red" : "neutral-border-weak"}
                    alignment={"middle center"}
                    cornerRadius={"small"}
                    width="80px"
                    height="30px"
                    backgroundColor={isGuessMode ? "white" : colors[wordIndex]}
                    onPress={isGuessMode ? () => handleCellClick(currentIndex) : undefined}
                >
                    <text 
                    color="white" 
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