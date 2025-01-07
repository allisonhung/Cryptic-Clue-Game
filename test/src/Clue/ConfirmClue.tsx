import { Devvit } from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import {DataStorage} from '../util/DataStorage.js';

Devvit.configure({
    redditAPI: true,
});

interface ConfirmClueProps {
    clue: string;
    solution: string;
    explanation: string;
    setPage: (page: string) => void;
    username: string;
  }

export const ConfirmClue = ({clue, solution, explanation, setPage, username}: ConfirmClueProps, context: Context): JSX.Element => {
    const postdata = new DataStorage(context);
  

    console.log("Clue", clue);
    console.log("Solution", solution);
    console.log("Explanation", explanation);

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
          solution: solution,
          explanation: explanation,
          authorId: username,
      })

      //console.log("words:", words);
      //console.log("colors:", colors);
      console.log("username from ConfirmClue", username);
      context.ui.showToast("Clue posted!");
      context.ui.navigateTo(post);
    }

    return (
        <vstack alignment="center" width="100%" height="100%">
          <spacer size="large" />
            <text weight="bold" color = "YellowOrange-100" size='xxlarge'>Confirm Clue</text>
            <text size='xlarge' color = "YellowOrange-100">Clue: {clue}</text>
            <spacer size="xsmall" />
            <text size='xlarge' color = "YellowOrange-100">Solution: {solution}</text>
            <spacer size="medium" />
            <button size="medium" appearance="media" onPress={postClue}>Post Clue</button>
            <spacer size="small" />
            <button icon="home" onPress={() => setPage('Home')} appearance='media'/>
        </vstack>
    );
};