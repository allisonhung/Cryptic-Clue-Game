import { Devvit } from "@devvit/public-api";
// To set up the board of 5 by 5
type BoardProps={
    words: string[];
    colors: string[];
    isGuessMode?: boolean;
    onCellClick?: (index: number) => void;
};

// Board component
export const Board = ({words, colors, isGuessMode = false, onCellClick}: BoardProps) => {
    const rows: JSX.Element[] = [];
    let wordIndex=0;
    for (let row = 0; row < 5; ++row) {
        const cells: JSX.Element[] = [];
        for (let col = 0; col < 5; ++col) {
            const currentIndex = wordIndex;
            cells.push(
                <vstack
                    key={`${row}-${col}`} 
                    border={"thick"}
                    alignment={"middle center"}
                    cornerRadius={"small"}
                    width="80px"
                    height="30px"
                    backgroundColor={isGuessMode ? "white" : colors[wordIndex]}
                    onPress={isGuessMode ? () => onCellClick?.(currentIndex) : undefined}
                >
                    <text 
                    color="black" 
                    outline="thin"
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