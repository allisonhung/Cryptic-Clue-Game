// import statements
// Need Context and useForm for fill form
// Need useInterval to force re-render
import type { Context } from '@devvit/public-api';
import { Devvit, useState, useInterval, useForm} from "@devvit/public-api";
import { StyledButton } from '../data/styledButton.js';

Devvit.configure({
    redditAPI: true,
  });

// For page navigation
interface GiveClueProps{
    setPage: (page: string) => void;
    onNext: (
        clue: string, 
        solution: string, 
        explanation: string,
    ) => void;
}

// Main function
export const GiveClue = (props: GiveClueProps, context: Context): JSX.Element => {
    // Clue giving
    const [clue, setClue] = useState<string>("");
    const [explanation, setExplanation] = useState<string>("");
    const [solution, setSolution] = useState<string>("");
    const clueForm = useForm(
        {
            fields: [
                {
                    name: "clue",
                    label: "Enter your clue. Make sure it includes the letter parsing at the end, i.e. Trim a tree (6)",
                    type: "string",
                },
                {
                    name: "solution",
                    label: "Enter the solution",
                    type: "string",
                },
                {
                    name: "explanation",
                    label: "Enter your explanation. Be detailed! This is your chance to show off your cryptic skills.",
                    type: "string",
                },
            ],
        },
        (values) => {
            setClue(values.clue as string);
            setSolution(values.solution as string);
            setExplanation(values.explanation as string);
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

            <text 
                weight="bold" 
                outline="none" 
                color ="Black" 
                size="xxlarge">Give a clue</text>

            <hstack width="95%" alignment="center middle">
                <vstack maxWidth="50%">
                    <text weight="bold" size="medium" color = "Black">{clue ? `CLUE: ${clue}` : "No clue given yet"}</text>
                    <text weight="bold" size="medium" color = "Black">{solution ? `SOLUTION: ${solution}` : ""}  </text>
                    <text weight="bold" size="medium" color = "Black">{explanation ? `EXPLANATION: ${explanation}` : ""}  </text>
                    <spacer height="20px"/>
                    <StyledButton 
                        width="200px"
                        height="40px"
                        onPress={() => context.ui.showForm(clueForm)}                        
                        label="Enter Clue" />
                    <spacer height="20px"/>
                    <StyledButton 
                        width="200px"
                        height="40px"
                        onPress={() => context.ui.navigateTo('https://s.wsj.net/blogs/html/wsjcrypticguide.pdf')}
                        label="Confused about cryptic crosswords? Click here" />
                    
   
                </vstack>
                <spacer width = "10px"/>
                <vstack>
                
                </vstack>
            </hstack>
            <hstack>
                <button appearance="media" icon="home" onPress={() => {
                    props.setPage('Home');
                }}/>
                <spacer width="10px"/>
                <button 
                    onPress={() => {
                    props.onNext(clue, solution,explanation);
                    }}
                    disabled={!clue}
                    >Submit</button>
            </hstack>
        </vstack>
    );
};

// Export page
export default GiveClue;