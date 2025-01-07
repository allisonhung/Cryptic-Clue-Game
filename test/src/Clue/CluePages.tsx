import {Devvit, useState} from '@devvit/public-api';
import type { Context } from '@devvit/public-api';

import {ConfirmClue} from './ConfirmClue.js';
import {GiveClue} from './GiveClue.js';
import { BACKGROUND_COLOR } from '../data/config.js';

interface CluePagesProps {
    setPage: (page: string) => void;
    username: string;
}

export const CluePages = (props: CluePagesProps): JSX.Element => {
    const [currentStep, setCurrentStep] = useState<string>("GiveClue");
    const [clue, setClue] = useState<string>("");
    const [solution, setSolution] = useState<string>("");
    const [explanation, setExplanation] = useState<string>("");

    const handleNext = (clue: string, solution: string, explanation: string) => {
        setClue(clue);
        setSolution(solution);
        setExplanation(explanation);
        setCurrentStep("ConfirmClue"); // Navigate to the next step after updating state
    };

    const steps: Record<string, JSX.Element> = {
        GiveClue: <GiveClue 
            {...props}
            onNext = {handleNext} />,
        ConfirmClue: <ConfirmClue 
            {...props}
            clue={clue} 
            solution={solution}
            explanation={explanation}
        />};

    return (
        <zstack width="100%" height="100%" backgroundColor={BACKGROUND_COLOR}>
            {steps[currentStep] || <text>Error: Step not found</text>}
        </zstack>
    );
};