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
            <text weight="bold" size='xxlarge' color="Black">How to Play</text>
            <vstack> 
                <spacer size="small" /> 
                <text wrap size="large" color="Black">Think you have what it takes to write cryptic clues?</text>
                <spacer size ="xsmall" />
                <text wrap size="large" color="Black">Want to solve some cryptic crossword answers but not a whole grid?</text>
                <spacer size="xsmall" />
                <text wrap size="large" color="Black">This game is for people who want to write or solve cryptic crossword clues, but don't want to do an entire puzzle.</text>
            </vstack>
            <button icon="home" onPress={() => setPage('Home')} appearance='media'/>
        </vstack> 
    </zstack>
);


export default HowToPlay;
