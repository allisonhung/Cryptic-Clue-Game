import { Devvit, useState, useAsync} from "@devvit/public-api";
import {Cluemain} from './Cluemain.js';
import { Guessmain } from "./Guessmain.js";
import type { Context } from "@devvit/public-api";
import { installGame } from "./installGame.js";

Devvit.configure({
  redditAPI: true,
  redis: true,
  media: true,
});

async function checkIfPostIsPinned(postId: string, context: Context) {
  const post = await context.reddit.getPostById(postId);
  console.log("post", post);
  return post.isStickied();
}

const Router: Devvit.CustomPostComponent = (context: Context) => {
  console.log("Router context", context);
  // Add null check for postId
  if (!context.postId) {
    return <text>Error: No post ID found</text>;
  }

  const { data: isPinned, loading, error } = useAsync(async () => {
    // Early return if no postId
    if (!context.postId) {
      throw new Error('No post ID found');
    }
    return await checkIfPostIsPinned(context.postId, context);
  });

  if (loading) {
    return <text>Loading...</text>;
  }

  if (error) {
    return <text>Error: {error.message}</text>;
  }
  
  return isPinned ? <Cluemain {...context} /> : <Guessmain {...context}/>;
}


Devvit.addCustomPostType({
  name: 'Cryptic Clue Game',
  description: 'based on Codenames',
  render: Router,
});

// create a menu option to create a pinned post of the game
Devvit.addMenuItem(installGame);

export default Devvit;