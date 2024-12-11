import { Devvit, useState, } from '@devvit/public-api';
import {CluePages} from './components/CluePages.js';
import HowToPlay from './components/HowToPlay.js';

Devvit.configure({
  redditAPI: true,
});

type PageProps = {
  setPage: (page: string) => void;
}

Devvit.addCustomPostType({
  name: 'Cryptic Clue Game',
  render: () => {
    const [page, setPage] = useState('Home');    
    let currentPage;
    
    switch (page) {
      case 'Home':
        currentPage = <Home setPage={setPage} />;
        break;
      case 'CluePages':
        currentPage = <CluePages setPage={setPage} />;
        break;
      case 'HowToPlay':
        currentPage = <HowToPlay setPage={setPage} />;
        break;
      default:
        currentPage = <Home setPage={setPage} />;
    }
    return (
      <blocks>
        {currentPage}
      </blocks>
    );
  },
});

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
      <text size='xxlarge' outline="thin" weight='bold'>
      Cryptic Clue Game </text>
      <button onPress={() => {
        setPage('CluePages');
      }}>
        Give a Clue
      </button>
      <button onPress={() => setPage('HowToPlay')}>
        How to Play
      </button>
    </vstack>
  </zstack>
)

export default Devvit;
