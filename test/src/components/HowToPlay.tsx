import { Devvit } from "@devvit/public-api";
type PageProps = {
  setPage: (page: string) => void;
};

const HowToPlay = ({ setPage }: PageProps) => (
  <vstack
    width="100%"
    height="100%"
    alignment="middle center"
    gap="large"
    backgroundColor="lightblue"
  >
    <text size="xxlarge">How to play page</text>
    <button onPress={() => setPage('Home')}>Back to menu</button>
  </vstack>
);

export default HowToPlay;