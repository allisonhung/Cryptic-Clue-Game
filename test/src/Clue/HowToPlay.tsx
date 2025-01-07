import {Devvit, } from '@devvit/public-api'
import { BACKGROUND_COLOR } from '../data/config.js';

type PageProps = {
    setPage: (page: string) => void;
    username: string;
  };

const HowToPlay = ({ setPage }: PageProps) => (
     <zstack 
       height="100%" width="100%" alignment="center middle" backgroundColor={BACKGROUND_COLOR}>
       <vstack
            width="100%"
            height="100%"
            alignment="middle center"
            gap="medium"
        >
            <text weight="bold" size='xxlarge' color="YellowOrange-200">How to Play!</text>
            <vstack> 
                <spacer size="small" /> 
                <text size="large" color="white"> The clue-giver provides a hint along with the number of cards it applies to. </text>
                <spacer size ="xsmall" />
                <text size="large" color="white">The guesser then tries to identify which cards are linked to the given clue.</text>
                <spacer size="xsmall" />
                <text size="large" color="white">Example: Clue: "Beach" -2  </text>
                <spacer size="xsmall" />
                <text size="large" color="white">Cards: "Sand," "Ocean," "Star," "Robot," "Whale" </text>
                <spacer size="xsmall" />
                <text size="large" color="white">Guesses: "Sand" and "Ocean"</text>
            </vstack>
            <button icon="home" onPress={() => setPage('Home')} appearance='media'/>
        </vstack> 
    </zstack>
);


export default HowToPlay;
