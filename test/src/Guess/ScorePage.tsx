import { Devvit, useAsync} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";

Devvit.configure({
    redditAPI: true,
  });
interface ScorePageProps{
    score: number;
    setPage: (page: string) => void;
}

export const ScorePage = ({score, setPage}: ScorePageProps, context: Context): JSX.Element => {
    const {data: username, loading} = useAsync(async () => {
        const currentUser = await context.reddit.getCurrentUser();
        return currentUser?.username ?? 'anon';
    });
    if (loading) {
        return <text>Loading...</text>;
    }
    return(
        <vstack height="100%" width="100%">
            <text size="xxlarge">Your username: {username}</text>
            <text size="xxlarge">Your Score: {score}</text>
            <button onPress={() => setPage('Home')}>Go back</button>
        </vstack>
    );
};