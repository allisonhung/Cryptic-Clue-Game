import { Devvit, useState} from '@devvit/public-api';
import { TEXT_COLOR } from './config.js';

interface StyledSolutionProps {
    label?: string;
    onPress?: () => void | Promise<void>;
    width?: number;
    hiddenLetters?: number[];
}

export const StyledSolution = (props: StyledSolutionProps): JSX.Element => {
    const {
      label: originalLabel,
      onPress,
      width,
      hiddenLetters
    } = props;


    if (!originalLabel) {
      throw new Error('No label provided');
    }
    if (!width) {
        throw new Error('No width provided');
    }
    let displayLabel = originalLabel;
    //replace hiddenLetters indices with a space
    if (hiddenLetters) {
        console.log("hiddenLetters: ", hiddenLetters);
        let newLabel = displayLabel.split('');
        hiddenLetters.forEach((index) => {
            newLabel[index] = ' ';
        });
        displayLabel = newLabel.join('');
    }

    const characters = displayLabel.toUpperCase().split('');

    const dynamicSize = (width/characters.length<40) ? (width / characters.length) : 40;


    return (
        <hstack onPress={onPress}>
            {characters.map((char, index) => (
                <hstack
                    key={index.toString()}
                    height= {`${dynamicSize}px`}
                    width= {`${dynamicSize}px`}
                    alignment="middle center"
                    backgroundColor="white"
                    border="thick"
                    borderColor="black"
                >
                    <text color= {hiddenLetters ? "Red" : TEXT_COLOR} size="large">{char}</text>
                </hstack>
                
            ))}
        </hstack>
    );
  };


