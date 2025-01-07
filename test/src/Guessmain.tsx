import { Devvit, useAsync, useState} from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import {DataStorage} from './util/DataStorage.js';
import { Board } from "./util/GenerateBoard.js";
import {ScorePage} from './Guess/ScorePage.js';
import { GuessLeaderBoard } from "./Guess/GuessLeaderBoard.js";

// note - need to add something so user can't submit multiple guess attempts. 
// immediately direct to leaderboard?

Devvit.configure({
    redditAPI: true,
});
type GuessmainProps = {
    username: string;
}

export const Guessmain = (props: GuessmainProps, context: Context): JSX.Element => {
    const postdata = new DataStorage(context);
    //console.log('username', props.username);
    const { data, loading, error } = useAsync(async () => {
        if (!context.postId) {
            throw new Error('Post ID is missing');
        }
        return await postdata.getClue(context.postId);
    });

    if (loading) {
        return (
            <blocks>
                <vstack height="100%" width="100%" alignment="center middle">
                    <text>Loading clue data...</text>
                </vstack>
            </blocks>
        );
    }

    if (error) {
        return (
            <blocks>
                <vstack height="100%" width="100%" alignment="center middle">
                    <text>Error loading clue: {error.message}</text>
                </vstack>
            </blocks>
        );
    }

    const [selectedCells, setSelectedCells] = useState<number[]>([]);
    
    

    if (data) {
        const [clue, solution, explanation, authorId] = data;
        const [feedback, setFeedback] = useState<string>('');
        const [isGameOver, setIsGameOver] = useState<boolean>(false);
        const [score, setScore] = useState<number>(0);
        const [currentPage, setCurrentPage] = useState<string>('Guessmain');
        console.log('authorId', authorId);
        //console.log('postId', postId);
        
        
        //console.log("correctCells", correctCells);

        async function onFinishTurn() {
            //console.log('Finishing turn...');
            if (!context.postId) {
                throw new Error('Post ID is missing');
            }
            postdata.addGuess({
                postId: context.postId, 
                username: props.username, 
                score: score
            });
            
            //console.log('score', score);
            //console.log('postId', postId);
            //console.log('userId', props.username);
            context.ui.showToast("Score saved!");
            setCurrentPage('ScorePage');
        };

        if(currentPage==='ScorePage'){
            if (!context.postId) {
                throw new Error('Post ID is missing');
            }
            return <ScorePage score={score} setPage={setCurrentPage} postId={context.postId} username={props.username}/>;
        }
        

        if (currentPage === 'GuessLeaderBoard') {
            if (!context.postId) {
                throw new Error('Post ID is missing');
            }
            return <GuessLeaderBoard setPage={setCurrentPage} postId={context.postId} username={props.username}  />;
        }

        return (
            <blocks>
                <zstack height="100%" width="100%" alignment="center middle" backgroundColor="#c0c9cc">
                    
                    <vstack height="100%" width="100%" alignment="center middle">
                        <hstack>
                            <vstack>
                            <text weight="bold" size="xxlarge" color="white">{feedback}</text>
                            <text weight="bold" size='xlarge' color = "YellowOrange-100">Clue: {clue}</text>
                            <text weight="bold" size='large' color = "YellowOrange-100">Score: {score}</text>
                            </vstack>
                            <spacer width="10px"/>
                            <vstack>
                            
                                <button appearance="media" onPress={onFinishTurn}>Finish turn</button>
                            </vstack>
                        </hstack>
                        
                    </vstack>
                </zstack>
            </blocks>
        );
    }
    

    return (
        <blocks>
        <vstack height="100%" width="100%" alignment="center middle">
            <text>Guessmain</text>
            <text>{context.postId}</text>
        </vstack>
        </blocks>
    );
}