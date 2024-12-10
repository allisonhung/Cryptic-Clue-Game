// Learn more at developers.reddit.com/docs
import { Devvit, } from '@devvit/public-api';
import GiveClue from './components/GiveClue.js';
import HowToPlay from './components/HowToPlay.js';

Devvit.configure({
  redditAPI: true,
});

type PageProps = {
  setPage: (page: string) => void;
}

Devvit.addCustomPostType({
  name: 'Cryptic Clue Game',
  render: context => {
    const {useState} = context;
    const [page, setPage] = useState('Home');
    let currentPage;
    
    switch (page) {
      case 'Home':
        currentPage = <Home setPage={setPage} />;
        break;
      case 'GiveClue':
        currentPage = <GiveClue setPage={setPage} />;
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
    <vstack alignment="center middle" gap="small">
      <text size='large' weight='bold'>
      Cryptic Clue Game </text>
      <button onPress={() => {
        setPage('GiveClue');
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
