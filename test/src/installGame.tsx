import type { MenuItem } from '@devvit/public-api';
import { Devvit } from '@devvit/public-api';
import { BACKGROUND_COLOR } from './data/config.js';

//installing the game will create a pinned post. This is where users will be able to create a new clue.
export const installGame: MenuItem = {
  label: 'Install cryptic clue game',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { ui, reddit } = context;
    const community = await reddit.getCurrentSubreddit();

    // Create a pinned post
    const post = await reddit.submitPost({
      title: 'Submit clues and see leaderboards here!',
      subredditName: community.name,
      preview: 
      <zstack height="100%" width="100%" alignment="center middle" backgroundColor={BACKGROUND_COLOR}>
    //background
      </zstack>
    });

    await post.sticky();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

    ui.navigateTo(post);
    ui.showToast('Installed cryptic clue game');
  },
};