import {Devvit, } from '@devvit/public-api'

type PageProps = {
    setPage: (page: string) => void;
    username: string;
  };

const HowToPlay = ({ setPage }: PageProps) => (
     <zstack 
       height="100%" width="100%" alignment="center middle">
    //background
       <image
      url="wood_background.jpg"
      description="wooden background"
      imageHeight={1024}
      imageWidth={2048}
      height="100%"
      width="100%"
      resizeMode="cover" />
       <vstack
            width="100%"
            height="100%"
            alignment="middle center"
            gap="medium"
        >
            <text size='xxlarge' color="YellowOrange-200">How to Play!</text>
            <vstack> 
                <spacer size="small" /> 
                <text color="YellowOrange-200"> The clue-giver provides a hint along with the number of cards it applies to. </text>
                <spacer size ="xsmall" />
                <text color="YellowOrange-200">The guesser then tries to identify which cards are linked to the given clue.</text>
                <spacer size="xsmall" />
                <text color="YellowOrange-200">Example: Clue: "Beach" -2  </text>
                <spacer size="xsmall" />
                <text color="YellowOrange-200">Cards: "Sand," "Ocean," "Star," "Robot," "Whale" </text>
                <spacer size="xsmall" />
                <text color="YellowOrange-200">Guesses: "Sand" and "Ocean"</text>
            </vstack>
            <button appearance="media" onPress={() => setPage('Home')}>Back to menu</button>
        </vstack> 
    </zstack>
);


export default HowToPlay;
