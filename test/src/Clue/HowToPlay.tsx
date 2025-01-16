import {Devvit, } from '@devvit/public-api'
import { BACKGROUND_COLOR, TEXT_COLOR} from '../data/config.js';
import type { Context } from '@devvit/public-api';

type PageProps = {
    setPage: (page: string) => void;
    username: string;
  };

const HowToPlay = ({ setPage }: PageProps, context: Context) => (
     <zstack 
       height="100%" width="100%" alignment="center middle" backgroundColor={BACKGROUND_COLOR}>
       <vstack
            width="100%"
            height="100%"
            alignment="middle center"
            gap="medium"
        >
            <text weight="bold" size='xxlarge' color={TEXT_COLOR}>How to Play</text>
            <vstack> 
                <spacer size="small" /> 
                <text wrap size="large" color={TEXT_COLOR}>Think you have what it takes to write cryptic clues?</text>
                <spacer size ="xsmall" />
                <text wrap size="large" color={TEXT_COLOR}>Want to solve some cryptic crossword answers but not a whole grid?</text>
                <spacer size="xsmall" />
                <text wrap size="large" color={TEXT_COLOR}>This game is for you. Scroll to solve/rate clues, or submit your own up top.</text>
                <hstack alignment="middle center" onPress={() => context.ui.navigateTo('https://s.wsj.net/blogs/html/wsjcrypticguide.pdf')}>
                    <text wrap color="Blue"> 
                        What's a cryptic crossword?
                    </text>
                </hstack>
            </vstack>
            <button icon="home" onPress={() => setPage('Home')} appearance='media'/>
        </vstack> 
    </zstack>
);


export default HowToPlay;
