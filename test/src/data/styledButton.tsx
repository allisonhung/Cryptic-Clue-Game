import { Devvit } from '@devvit/public-api';
import { BACKGROUND_COLOR } from './config.js';

interface StyledButtonProps {
    onPress?: () => void | Promise<void>;
    label?: string;
    width?: Devvit.Blocks.SizeString;
    height?: Devvit.Blocks.SizeString;
    backgroundColor?: string;
}

export const StyledButton = (props: StyledButtonProps): JSX.Element => {
    const {
      onPress,
      label,
      width = '100px',
      height = '40px',
      backgroundColor = BACKGROUND_COLOR
    } = props;
  
    return (
        <hstack
          height={height}
          width={width}
          onPress={onPress}
          backgroundColor= {backgroundColor}
          padding="xsmall"
          border="thick"
          borderColor="Black"
        >
          <hstack
            height="100%"
            width="100%"
            gap="small"
            alignment="middle center"
            backgroundColor= {backgroundColor}
          >
            <text color="Black" size="medium">{label}</text>
          </hstack>
        </hstack>
    );
  };