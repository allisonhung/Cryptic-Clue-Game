import { Devvit, useState, } from '@devvit/public-api';
import {CluePages} from './Clue/CluePages.js';
import HowToPlay from './Clue/HowToPlay.js';
import type { Context } from '@devvit/public-api';
import {Leaderboard} from './Leaderboard.js';

Devvit.configure({
  redditAPI: true,
});

type PageProps = {
  setPage: (page: string) => void;
  username: string;
}

type CluemainProps = {
  username: string;
}

export const Cluemain = (props: CluemainProps, context: Context): JSX.Element => {
    //console.log("username", props.username);
    const [page, setPage] = useState('Home');    
    let currentPage;
    
    switch (page) {
      case 'Home':
        currentPage = <Home setPage={setPage} username={props.username}/>;
        break;
      case 'CluePages':
        currentPage = <CluePages setPage={setPage} username={props.username}/>;
        break;
      case 'HowToPlay':
        currentPage = <HowToPlay setPage={setPage} username={props.username}/>;
        break;
      case 'Leaderboard':
        currentPage = <Leaderboard setPage={setPage} username={props.username}/>;
        break;
      default:
        currentPage = <Home setPage={setPage} username = {props.username}/>;
    }
    return (
      <blocks>
        {currentPage}
      </blocks>
    );
  };

const Home = ({setPage}: PageProps) => (
  <zstack height="100%" width="100%" alignment="center middle">
    //background
    <image
      url="wood_background.jpg"
      description="wooden background"
      imageHeight={1024}
      imageWidth={2048}
      height="100%"
      width="100%"
      resizeMode="cover" />
    <vstack alignment="center middle" gap="medium">
      <text color ="YellowOrange-100" size='xxlarge' weight='bold'>
      Cryptic Clue Game </text>
      <button appearance="media" onPress={() => {
        setPage('CluePages');
      }}>
        Give a Clue
      </button>
      <button appearance="media" onPress={() => setPage('HowToPlay')}>
        How to Play
      </button>
      <button appearance="media" onPress={() => setPage('Leaderboard')}>
        See your posts / leaderboard
      </button>
    </vstack>
  </zstack>
)

