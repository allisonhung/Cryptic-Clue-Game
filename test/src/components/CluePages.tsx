import {Devvit, useState} from '@devvit/public-api';
import type { Context } from '@devvit/public-api';

import {ConfirmClue} from './ConfirmClue.js';
import {GiveClue} from './GiveClue.js';

interface CluePagesProps {
    setPage: (page: string) => void;
    context: Context;
}

export const CluePages = (props: CluePagesProps): JSX.Element => {
    const [currentStep, setCurrentStep] = useState<string>("GiveClue");
    const [clue, setClue] = useState<string>("");
    const [wordcount, setWordcount] = useState<number>(0);

    const steps: Record<string, JSX.Element> = {
        GiveClue: <GiveClue 
            {...props}
            onNext = {(clue, wordcount) => {
                setClue(clue);
                setWordcount(wordcount);
                setCurrentStep("ConfirmClue");
        }} />,
        ConfirmClue: <ConfirmClue 
        {...props}
        clue={clue} wordcount={wordcount} 
        />};

    return (
        <vstack width="100%" height="100%">
            {steps[currentStep] || <text>Error: Step not found</text>}
        </vstack>
    );
};