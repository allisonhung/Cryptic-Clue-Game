import { Devvit, useState, } from '@devvit/public-api';
import {CluePages} from './Clue/CluePages.js';
import HowToPlay from './Clue/HowToPlay.js';
import type { Context } from '@devvit/public-api';
import {Leaderboard} from './leaderboard.js';
import { StyledButton } from './data/styledButton.js';
import { StyledSolution } from './data/styledSolution.js';
import { UserStats } from './UserStats.js';
import { BACKGROUND_COLOR } from './data/config.js';

Devvit.configure({
  redditAPI: true,
});

type PageProps = {
  setPage: (page: string) => void;
  username: string;
  appWidth: number | undefined;
}

type CluemainProps = {
  username: string;
}

export const Cluemain = (props: CluemainProps, context: Context): JSX.Element => {
    const appWidth = context.dimensions?.width;

    const [page, setPage] = useState('Home');    
    let currentPage;
    //console.log("appWidth from Cluemain: ", appWidth);
    
    switch (page) {
      case 'Home':
        currentPage = <Home setPage={setPage} username={props.username} appWidth={appWidth}/>;
        break;
      case 'CluePages':
        currentPage = <CluePages setPage={setPage} username={props.username} appWidth={appWidth}/>;
        break;
      case 'HowToPlay':
        currentPage = <HowToPlay setPage={setPage} username={props.username} />;
        break;
      case 'Leaderboard':
        currentPage = <Leaderboard setPage={setPage} username={props.username} />;
        break;
      case 'UserStats':
        currentPage = <UserStats setPage={setPage} username={props.username} />;
        break;
      default:
        currentPage = <Home setPage={setPage} username = {props.username} appWidth={appWidth}/>;
    }
    return (
      <blocks>
        {currentPage}
      </blocks>
    );
  };


const Home = ({setPage, username, appWidth}: PageProps) => (
  <zstack height="100%" width="100%" alignment="center middle" backgroundColor={BACKGROUND_COLOR}>
    
    <vstack alignment="center middle" gap="medium">
      <StyledSolution
        label="Cryptic"
        width={appWidth}/>
      
      <StyledButton 
        width="200px"
        height="50px"
        onPress={() => setPage('CluePages')}
        label="Give a Clue" />
      
      <StyledButton 
        width="200px"
        height="50px"
        onPress={() => setPage('HowToPlay')}
        label="How to play" />
      
      <StyledButton 
        width="200px"
        height="50px"
        onPress={() => setPage('Leaderboard')}
        label="Leaderboards" />
      
      <StyledButton 
        width="200px"
        height="50px"
        onPress={() => setPage('UserStats')}
        label="See my stats" />
      
    </vstack>
  </zstack>
)

