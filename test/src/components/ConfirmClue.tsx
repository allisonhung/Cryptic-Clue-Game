import { Devvit } from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import {PostData} from '../util/PostData.js';

interface ConfirmClueProps {
    clue: string;
    wordcount: number;
    words: string[];
    colors: string[];
    setPage: (page: string) => void;
  }

export const ConfirmClue = ({clue, wordcount, words, colors, setPage}: ConfirmClueProps, context: Context): JSX.Element => {
    const postdata = new PostData(context);
    console.log("words:", words);
    console.log("colors:", colors);
    async function postClue() {
        const post = await context.reddit.submitPost({
            title: 'Guess the words!',
            subredditName: 'crypticcluegame',
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
        })

        console.log("words:", words);
        console.log("colors:", colors);
        context.ui.showToast("Clue posted!");
        context.ui.navigateTo(post);
    }

    return (
        <vstack width="100%" height="100%">
            <text>Confirm Clue</text>
            <text>Clue: {clue}</text>
            <text>Wordcount: {wordcount}</text>
            <button onPress={postClue}>Post Clue</button>
            <button onPress={() => setPage('Home')}>Cancel</button>
        </vstack>
    );
};