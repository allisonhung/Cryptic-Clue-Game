import { Devvit } from '@devvit/public-api';

interface StyledSolutionProps {
    label?: string;
}

export const StyledSolution = (props: StyledSolutionProps): JSX.Element => {
    const {
      label,
    } = props;

    if (!label) {
      throw new Error('No label provided');
    }
    const characters = label.toUpperCase().split('');

    return (
        <hstack gap="small">
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