import { Devvit } from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import {DataStorage} from '../util/DataStorage.js';
import { BACKGROUND_COLOR, TEXT_COLOR} from "../data/config.js";
import { StyledSolution } from "../data/styledSolution.js";
import { StyledButton } from "../data/styledButton.js";

Devvit.configure({
    redditAPI: true,
});

interface ConfirmClueProps {
    clue: string;
    solution: string;
    explanation: string;
    setPage: (page: string) => void;
    username: string;
    appWidth: number | undefined;
  }

export const ConfirmClue = ({clue, solution, explanation, setPage, username, appWidth}: ConfirmClueProps, context: Context): JSX.Element => {
    const postdata = new DataStorage(context);

    async function postClue() {
      const community = await context.reddit.getCurrentSubreddit();
      const post = await context.reddit.submitPost({
          title: clue,
          subredditName: community.name,
          preview: (
            <zstack height="100%" width="100%" alignment="center middle" backgroundColor={BACKGROUND_COLOR}>
              
              <text>Loading...</text>
            </zstack>
          ),
      });
        
      //store clue data, including postID, clue, solution, explanation, and authorID
      postdata.submitClue({
          postId: post.id,
          clue: clue,
          solution: solution,
          explanation: explanation,
          authorId: username,
      })

      //store postID in user's data

      //navigate to post
      context.ui.showToast("Clue posted!");
      context.ui.navigateTo(post);
    }

    return (
      <vstack alignment="center middle" width="100%" height="100%">
        <text weight="bold" color = {TEXT_COLOR} size='xxlarge'>confirm submission</text>
        <spacer size="xsmall" />
        <text size='xlarge' color = {TEXT_COLOR}>Clue: {clue}</text>
        <spacer size="xsmall" />
        <StyledSolution label={solution} width = {appWidth}/>
        <spacer size="xsmall" />
        <text wrap size='xlarge' color = {TEXT_COLOR} width = "70%">Explanation: {explanation}</text>
        <spacer size="xsmall" />
        <hstack alignment="center middle">
          <StyledButton
            width = "200px"
            height = "40px"
            onPress={postClue}
            label="Post Clue"
          />
          <spacer size="xsmall" />
          <button icon="home" onPress={() => setPage('Home')} appearance='media'/>
        </hstack>
      </vstack>
    );
};