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
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [label, setLabel] = useState<string>("Finish writing your clue!");
    const clueForm = useForm(
        {
            fields: [
                {
                    name: "clue",
                    label: "Enter your clue. Make sure it includes the letter parsing at the end, i.e. Trim a tree (6)",
                    type: "string",
                },
            ],
        },
        (values) => {
            setClue(values.clue as string);
        }
    );
    const solutionForm = useForm(
        {
            fields: [
                {
                    name: "solution",
                    label: "Enter the solution",
                    type: "string",
                },
            ],
        },
        (values) => {
            setSolution((values.solution as string).replace(/\s+/g, '').toUpperCase());
        }
    );
    const explanationForm = useForm(
        {
            fields: [
                {
                    name: "explanation",
                    label: "Enter your explanation. Be detailed! This is your chance to show off your cryptic skills.",
                    type: "string",
                },
            ],
        },
        (values) => {
            setExplanation(values.explanation as string);
        }
    );

    // Regularly force re-render every second
    const [counter, setCounter] = useState(1000);  
    const updateInterval = useInterval(() => {  
    setCounter((counter) => counter - 1);  
    }, 1000);  
    updateInterval.start();

    const popupInterval = useInterval(() => {
        setShowPopup(false);
      }, 2000);
  
    const handleButtonPress = () => {
        if (!clue || !solution || !explanation) {
            setShowPopup(true);
            setLabel("Please fill out all fields.")
            popupInterval.start();
        }
        //check if clue contains the letter parsing
        else if(!clue.includes("(") || !clue.includes(")")){
            setShowPopup(true);
            setLabel("clue does not contain proper letter parsing.")
            popupInterval.start();
        }
        //check if explanation is detailed enough
        else if(explanation.length < 50){
            setShowPopup(true);
            setLabel("explanation is not detailed enough.")
            popupInterval.start();
        }
        
        else{
            props.onNext(clue, solution, explanation);
        }
        
    };

    // main return function
    return (
        <zstack alignment='middle center' width="100%" height="100%">
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

                <hstack width="95%" alignment="middle center">
                    <vstack maxWidth="70%" alignment="middle center">
                        <StyledButton 
                            width="200px"
                            height="30px"
                            backgroundColor="White"
                            onPress={() => context.ui.showForm(clueForm)}                        
                            label={clue ? `${clue}` : "Enter Clue"} />
                        <spacer height="5%"/>
                        <StyledButton 
                            width="200px"
                            height="30px"
                            backgroundColor="White"
                            onPress={() => context.ui.showForm(solutionForm)}                        
                            label={solution ? `${solution}` : "Enter Solution"} />
                        <spacer height="5%"/>
                        <StyledButton 
                            width="200px"
                            height="30px"
                            backgroundColor="White"
                            onPress={() => context.ui.showForm(explanationForm)}                        
                            label={explanation ? `${explanation}` : "Enter Explanation"} />
                        <spacer height="5%"/>
                        
                        <text onPress={() => context.ui.navigateTo('https://s.wsj.net/blogs/html/wsjcrypticguide.pdf')} color="Blue"> 
                            Confused about cryptic crosswords? Click here
                        </text>
                        
                    </vstack>
                    
                </hstack>
                <hstack>
                    <button appearance="media" icon="home" onPress={() => {
                        props.setPage('Home');
                    }}/>
                    <spacer width="10px"/>
                    <StyledButton 
                            width="200px"
                            height="40px"
                            onPress={handleButtonPress}                        
                            label="Submit" />
                    
                </hstack>
                
            </vstack>
            {showPopup && (
                <hstack 
                    backgroundColor="white" 
                    border="thick" 
                    borderColor="black" 
                    padding="medium"
                    alignment='middle center'
                >
                    <text color="Red">{label}</text>
                </hstack>
            )}
        </zstack>
    );
};

// Export page
export default GiveClue;