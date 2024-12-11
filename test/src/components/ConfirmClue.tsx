import { Devvit } from "@devvit/public-api";
import type { Context } from "@devvit/public-api";

interface ConfirmClueProps {
    clue: string;
    wordcount: number;
    onCancel: () => void;
    setPage: (page: string) => void;
  }

export const ConfirmClue = ({clue, wordcount, onCancel, setPage}: ConfirmClueProps, context: Context): JSX.Element => {
    
    async function postClue() {
        context.ui.showToast("Clue posted!");
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