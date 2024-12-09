import { Devvit } from "@devvit/public-api";

type PageProps = {
  setPage: (page: string) => void;
};

export const Board = () => {
    const rows = [];
    for (let row = 0; row < 5; ++row) {
        const cells = [];
        for (let col = 0; col < 5; ++col) {
            cells.push(
                <vstack
                    key={`${row}-${col}`} 
                    border={"thick"}
                    alignment={"middle center"}
                    cornerRadius={"small"}
                    width="40px"
                    height="20px"
                    backgroundColor={"white"}
                />
            );
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

const GiveClue = ({ setPage }: PageProps) => (
    <vstack
        width="100%"
        height="100%"
        alignment="middle center"
        gap="large"
        backgroundColor="lightblue">
        <text size="xxlarge">Clue giving page</text>
        <hstack width="100%" height="2px" />
        <Board />
        <button onPress={() => setPage('Home')}>Back to menu</button>
    </vstack>
);



export default GiveClue;