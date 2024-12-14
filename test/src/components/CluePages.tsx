import {Devvit, useState} from '@devvit/public-api';
import type { Context } from '@devvit/public-api';

import {ConfirmClue} from './ConfirmClue.js';
import {GiveClue} from './GiveClue.js';

interface CluePagesProps {
    setPage: (page: string) => void;
}

export const CluePages = (props: CluePagesProps): JSX.Element => {
    const [currentStep, setCurrentStep] = useState<string>("GiveClue");
    const [clue, setClue] = useState<string>("");
    const [wordcount, setWordcount] = useState<number>(0);
    const [words, setWords] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [correctCells, setCorrectCells] = useState<number[]>([]);

    const steps: Record<string, JSX.Element> = {
        GiveClue: <GiveClue 
            {...props}
            onNext = {(clue, wordcount, words, colors, ) => {
                setClue(clue);
                setWordcount(wordcount);
                setWords(words);
                setColors(colors);
                setCurrentStep("ConfirmClue");
                setCorrectCells(correctCells);
        }} />,
        ConfirmClue: <ConfirmClue 
        {...props}
        clue={clue} 
        wordcount={wordcount} 
        words = {words} 
        colors = {colors}
        correctCells = {correctCells}
        />};

    return (
        <zstack width="100%" height="100%">
            <image url="wood_background.jpg" description="wooden background" imageHeight={1024} imageWidth={2048} height="100%" width="100%" resizeMode="cover" />
            {steps[currentStep] || <text>Error: Step not found</text>}
        </zstack>
    );
};