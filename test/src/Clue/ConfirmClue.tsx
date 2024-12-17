import { Devvit } from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import {DataStorage} from '../util/DataStorage.js';

Devvit.configure({
    redditAPI: true,
});

interface ConfirmClueProps {
    clue: string;
    wordcount: number;
    words: string[];
    colors: string[];
    setPage: (page: string) => void;
    correctCells: number[];
    username: string;
  }

export const ConfirmClue = ({clue, wordcount, words, colors, setPage, correctCells, username}: ConfirmClueProps, context: Context): JSX.Element => {
    const postdata = new DataStorage(context);
    
    //console.log("words:", words);
    //console.log("colors:", colors);

    console.log("correctCells", correctCells);
    async function postClue() {
      const community = await context.reddit.getCurrentSubreddit();
      const post = await context.reddit.submitPost({
          title: 'Guess the words!',
          subredditName: community.name,
          preview: (
            <zstack height="100%" width="100%" alignment="center middle">
              <image
                url="wood_background.jpg"
                description="wooden background"
                imageHeight={1024}
                imageWidth={2048}
                height="100%"
                width="100%"
                resizeMode="cover" />
              <text>Loading...</text>
            </zstack>
          ),
      });
        
      postdata.submitClue({
          postId: post.id,
          clue: clue,
          wordCount: wordcount,
          words: words,
          colors: colors,
          correctCells: correctCells,
          authorId: username,
      })

      //console.log("words:", words);
      //console.log("colors:", colors);
      console.log("username from ConfirmClue", username);
      context.ui.showToast("Clue posted!");
      context.ui.navigateTo(post);
    }

    return (
        <vstack width="100%" height="100%">
            <text size='xlarge'>Confirm Clue</text>
            <text size='xxlarge' color = "YellowOrange-100">Clue: {clue}</text>
            <spacer size="xsmall" />
            <text size='xxlarge' color = "YellowOrange-100">Wordcount: {wordcount}</text>
            <spacer size="xsmall" />
            <button size="medium" appearance="media" onPress={postClue}>Post Clue</button>
            <spacer size="small" />
            <button size="medium" appearance="media" onPress={() => setPage('Home')}>Cancel</button>
        </vstack>
    );
};