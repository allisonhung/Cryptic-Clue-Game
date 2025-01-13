import { Devvit, useState} from '@devvit/public-api';

interface StyledSolutionProps {
    label?: string;
    onPress?: () => void | Promise<void>;
    width?: number;
}

export const StyledSolution = (props: StyledSolutionProps): JSX.Element => {
    const {
      label,
      onPress,
      width
    } = props;

    const [reduce, setReduce] = useState<boolean>(false);

    if (!label) {
      throw new Error('No label provided');
    }
    if (!width) {
        throw new Error('No width provided');
    }
    const characters = label.toUpperCase().split('');

    //test if width of all characters is less than width



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
                    <text color="black" size="medium">{char}</text>
                </hstack>
                
            ))}
        </hstack>
    );
  };

interface EmptySolutionProps {
    length?: number;
    onPress?: () => void | Promise<void>;
    width?: number;
}
export const EmptySolution = (props: EmptySolutionProps): JSX.Element => {
    const {
        length = 5,
        onPress,
        width
    } = props;

    const [reduce, setReduce] = useState<boolean>(false);

    if (!width) {
        throw new Error('No width provided');
    }

    const dynamicSize = (width/length<40) ? (width / length) : 40;

    return (
        <hstack onPress={onPress}>
            {Array.from({ length }, (_, index) => (
                <hstack
                    key={index.toString()}
                    height={`${dynamicSize}px`}
                    width={`${dynamicSize}px`}
                    alignment="middle center"
                    backgroundColor="white"
                    border="thick"
                    borderColor="black"
                >
                    <text color="black" size="medium"> </text>
                </hstack>
                
            ))}
        </hstack>
    );
}