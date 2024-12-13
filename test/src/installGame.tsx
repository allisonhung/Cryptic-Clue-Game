import type { MenuItem } from '@devvit/public-api';
import { Devvit } from '@devvit/public-api';

export const installGame: MenuItem = {
  label: 'Install cryptic clue game',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { ui, reddit } = context;
    const community = await reddit.getCurrentSubreddit();

    // Create a pinned post
    const post = await reddit.submitPost({
      title: 'Pinned post',
      subredditName: community.name,
      preview: 
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
      </zstack>
    });

    await post.sticky();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

    ui.navigateTo(post);
    ui.showToast('Installed cryptic clue game');
  },
};