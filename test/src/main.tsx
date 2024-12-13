import { Devvit } from "@devvit/public-api";
import {Cluemain} from './Cluemain.js';
import { Guessmain } from "./Guessmain.js";
import type { Context } from "@devvit/public-api";

Devvit.configure({
  redditAPI: true,
  redis: true,
  media: true,
});



//alter this so that it will either lead to Cluemain or Guessmain, depending on the post type. 
Devvit.addCustomPostType({
  name: 'Cryptic Clue Game',
  description: 'based on Codenames',
  render: Cluemain,
});

export default Devvit;