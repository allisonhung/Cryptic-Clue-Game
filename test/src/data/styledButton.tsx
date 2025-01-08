import { Devvit } from '@devvit/public-api';
import { BACKGROUND_COLOR } from './config.js';

interface StyledButtonProps {
    onPress?: () => void | Promise<void>;
    label?: string;
    width?: Devvit.Blocks.SizeString;
    height?: Devvit.Blocks.SizeString;
}

export const StyledButton = (props: StyledButtonProps): JSX.Element => {
    const {
      onPress,
      label,
      width = '100px',
      height = '40px',
    } = props;
  
    return (
        <hstack
          height={height}
          width={width}
          onPress={onPress}
          backgroundColor= {BACKGROUND_COLOR}
          padding="xsmall"
          border="thick"
          borderColor="Black"
        >
          <hstack
            height="100%"
            width="100%"
            gap="small"
            alignment="middle center"
            backgroundColor= {BACKGROUND_COLOR}
          >
            <text color="Black" size="medium">{label}</text>
          </hstack>
        </hstack>
    );
  };