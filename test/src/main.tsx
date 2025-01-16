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

//router checks if the post type is pinned, and will direct to either Cluemain or Guessmain
//also checks if the user is logged in
async function checkIfPostIsPinned(postId: string, context: Context) {
  const post = await context.reddit.getPostById(postId);
  return post.isStickied();
}

const Router: Devvit.CustomPostComponent = (context: Context) => {
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

  const getUsername = async () => {
    if (!context.userId) return null; // Return early if no userId
    const cacheKey = 'cache:userId-username';
    const cache = await context.redis.hGet(cacheKey, context.userId);
    if (cache) {
      return cache;
    } else {
      const user = await context.reddit.getUserById(context.userId);
      if (user) {
        await context.redis.hSet(cacheKey, {
          [context.userId]: user.username,
        });
        return user.username;
      }
    }
    return null;
  };


  const [data] = useState<{
    username: string | null;
    postId: string;
  }>(async () => {
    const [username, postId] = await Promise.all([getUsername(), context.postId as string]);
    return { username, postId };
  });



  if (loading) {
    return <text>Loading...</text>;
  }

  if (error) {
    return <text>Error: {error.message}</text>;
  }
  const safeUsername = data.username ?? 'anon';
  return isPinned ? <Cluemain username = {safeUsername} {...context} /> : <Guessmain username = {safeUsername} {...context}/>;
}


Devvit.addCustomPostType({
  name: 'Cryptic Clue Game',
  description: 'inspired by Pixelary',
  height: 'tall',
  render: Router,
});

// create a menu option to create a pinned post of the game
Devvit.addMenuItem(installGame);

export default Devvit;