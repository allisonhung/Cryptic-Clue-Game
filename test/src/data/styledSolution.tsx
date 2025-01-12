import { Devvit } from '@devvit/public-api';

interface StyledSolutionProps {
    label?: string;
    onPress?: () => void | Promise<void>;
}

export const StyledSolution = (props: StyledSolutionProps): JSX.Element => {
    const {
      label,
      onPress,
    } = props;

    if (!label) {
      throw new Error('No label provided');
    }
    const characters = label.toUpperCase().split('');

    return (
        <hstack onPress={onPress}>
            {characters.map((char, index) => (
                <hstack
                    key={index.toString()}
                    height="40px"
                    width="40px"
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
}
export const EmptySolution = (props: EmptySolutionProps): JSX.Element => {
    const {
        length = 5,
        onPress,
    } = props;

    return (
        <hstack onPress={onPress}>
            {Array.from({ length }, (_, index) => (
                <hstack
                    key={index.toString()}
                    height="40px"
                    width="40px"
                    alignment="middle center"
                    backgroundColor="white"
                    border="thick"
                    borderColor="black"
                >
                    <text color="black" size="medium"></text>
                </hstack>
            ))}
        </hstack>
    );
}