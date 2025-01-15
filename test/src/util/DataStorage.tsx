import type {
    RedditAPIClient,
    RedisClient,
    Scheduler,
  } from '@devvit/public-api';

export class DataStorage {
    readonly redis: RedisClient;
    readonly reddit?: RedditAPIClient;
    readonly scheduler?: Scheduler;

    constructor(context: { redis: RedisClient; reddit?: RedditAPIClient; scheduler?: Scheduler }) {
    this.redis = context.redis;
    this.reddit = context.reddit;
    this.scheduler = context.scheduler;
    }

    readonly keys = {
        //stores post data (clue, solution, explanation, authorId)
        postData: (postId: string) => `post:${postId}`,

        //stores user data (username, authoredPosts, guessedPosts)
        userData: (userId: string) => `user-data:${userId}`,

        //stores scores for each post (1 if solved, 0 if gave up)
        postScores: (postId: string) => `post-scores:${postId}`,

        //stores win history for each post (username, date solved)
        winHistory: (postId: string) => `post:${postId}`,

        //stores scores for each user (1 if solved, 0 if gave up)
        userScores: (postId: string) => `post-guesses:${postId}`,

        //stores all existing authors of clues
        clueAuthors: () => 'clue-authors',
        //stores all existing solvers of clues
        clueSolvers: () => 'clue-solvers',
    }

// when a clue is submitted, 
// hset the post data (postID, clue, solution, explanation, authorId), 
// zadd the post id to the user's posts, 
// zadd the user to the post scores, 
// zadd the user to the clue authors

async submitClue(data: {
        postId: string;
        clue: string;
        solution: string;
        explanation: string;
        authorId: string;
    }): Promise<void> {
        if (!this.scheduler || !this.reddit) {
            console.error('Scheduler or Reddit API not available');
            return;
        }
        const key = this.keys.postData(data.postId);
        const userKey = this.keys.userData(data.authorId);

        //either get the user's authored posts or create an empty array
        const userData = await this.redis.hGet(userKey, 'authoredPosts');
        const authoredPosts = userData ? JSON.parse(userData) : [];
        //add the post to the user's authored posts
        authoredPosts.push(data.postId);

        await Promise.all([
            //store the post data
            this.redis.hSet(key, {
                postId: data.postId,
                clue: data.clue,
                solution: data.solution,
                explanation: data.explanation,
                authorId: data.authorId,
                ratings: JSON.stringify([]),
                scores: JSON.stringify([]),
            }),

            //add this post to the user's authored posts
            this.redis.hSet(userKey, {
                username: data.authorId,
                authoredPosts: JSON.stringify(authoredPosts),
            }),

            //add the user to the list of all clue authors
            this.redis.zAdd(this.keys.clueAuthors(), {
                member: data.authorId,
                score: Date.now(), 
    }),
]);
    }

    //retrieve post data by post id
    async getClue(postId: string): Promise<[string, string, string, string]> {
        try {
            const key = this.keys.postData(postId);
            const data = await this.redis.hGetAll(key);
            
            if (!data || !data.clue) {
                throw new Error(`No clue found for post ${postId}`);
            }
    
            return [
                data.clue,
                data.solution,
                data.explanation,
                data.authorId,
            ];
        } catch (error) {
            console.error('Failed to get clue data:', error);
            throw error;
        }
    }

    //submitting a guess
    async addGuess(data: {
        postId: string, 
        username: string, 
        score: number
        numGuesses: number
    }): Promise<void> {
        if (!this.scheduler || !this.reddit) {
            console.error('Scheduler or Reddit API not available');
            return;
        }
        try {
            const key = this.keys.userData(data.username)
            const userData = await this.redis.hGet(key, 'solvedPosts');
            const postkey = this.keys.postData(data.postId);
            const winKey = this.keys.winHistory(data.postId);
            const solvedPosts = userData ? JSON.parse(userData) : [];

            solvedPosts.push(data.postId);

            //store points. This will either be a 0 or a 1.
            const userPoints = await this.redis.hGet(key, 'points');
            const points = userPoints ? JSON.parse(userPoints) : [];
            //add score to points
            points.push(data.score);

            //add score to post data
            const post = await this.redis.hGet(postkey, 'scores');
            const scores = post ? JSON.parse(post) : [];
            scores.push(data.score);

            //add the guess to the hset
            const winData = await this.redis.hGet(winKey, 'loggedSolves');
            //parse the winData array
            const winDataPost = winData ? JSON.parse(winData) : [];
            console.log('old win data', winDataPost);
            
            winDataPost.push({
                username: data.username,
                date: Date.now().toString(),
                numGuesses: data.numGuesses.toString(),
                score: data.score.toString(),
            });
            console.log('new win data array:', winDataPost);

            //add winDataArray to hset
            await this.redis.hSet(winKey,{
                loggedSolves: JSON.stringify(winDataPost),
            });



            //add the user's userId and their score to the post's scores
            await this.redis.zAdd(this.keys.userScores(data.postId), {
                member: data.username,
                score: data.score,
            });

            await this.redis.hSet(postkey, {
                scores: JSON.stringify(scores),
            });

            //add the post to the user's solved posts
            await this.redis.hSet(key, {
                solvedPosts: JSON.stringify(solvedPosts),
                points: JSON.stringify(points),
            });

            //add the user to the list of all clue solvers
            await this.redis.zAdd(this.keys.clueSolvers(), {
                member: data.username,
                score: Date.now(),
            });

            /*this is depreciated. Stop using this and use a hash 
            //add the post to post scores
            await this.redis.zAdd(this.keys.postScores(data.postId), {
                member: data.username,
                score: data.score,
            });
            */
            

            
            
        } catch (error) {
            console.error('Failed to add guess:', error);
            throw error;
    }}


    //submitting a rating
    async addRating(data: {
        postId: string,
        rating: number,
        userRated: string
    }): Promise<void> {
        if (!this.scheduler || !this.reddit) {
            console.error('Scheduler or Reddit API not available');
            return;
        }
        try {

            const key = this.keys.postData(data.postId);
            const post = await this.redis.hGet(key, 'ratings');
            const ratings = post ? JSON.parse(post) : [];

            //check if userRated is already in ratings. If they are, remove their old rating
            const index = ratings.findIndex((rating: {userRated: string}) => rating.userRated === data.userRated);
            if (index !== -1) {
                ratings.splice(index, 1);
            }
            //add the new rating
            ratings.push({rating: data.rating, userRated: data.userRated});
            
            await this.redis.hSet(key, {
                ratings: JSON.stringify(ratings),
            });
        } catch (error) {
            console.error('Failed to add rating:', error);
            throw error;
        }
    }

    //returns the average rating for a post
    async getRating(postId: string): Promise<number> {
        try {
            const key = this.keys.postData(postId);
            const post = await this.redis.hGet(key, 'ratings');
            const ratings = post ? JSON.parse(post) : [];
            const sum = ratings.reduce((acc: number, rating: {rating: number}) => acc + rating.rating, 0);
            return (sum / ratings.length);
        } catch (error) {
            console.error('Failed to get rating:', error);
            throw error;
        }
    }
    async getRatings(postId: string): Promise<number[]> {
        try {
            const key = this.keys.postData(postId);
            const post = await this.redis.hGet(key, 'ratings');
            const ratings = post ? JSON.parse(post) : [];
            return ratings;
        } catch (error) {
            console.error('Failed to get rating:', error);
            throw error;
        }
    }

    //get all users who have submitted a clue
    async getAllUsers(): Promise<string[]> {
        try {
            const authors = await this.redis.zRange(this.keys.clueAuthors(), 0, -1);
            return authors.map(author => author.member);
        } catch (error) {
            console.error('Failed to get all users:', error);
            throw error;
        }
    }

    //get all users who have solved a clue
    async getAllSolvers(): Promise<string[]> {
        try {
            const solvers = await this.redis.zRange(this.keys.clueSolvers(), 0, -1);
            return solvers.map(solver => solver.member);
        } catch (error) {
            console.error('Failed to get all solvers:', error);
            throw error;
        }
    }

    
    //get all the scores for a given post
    async getScores(postId: string): Promise<WinData[]> {
        try {
            //const zRangeKey = this.keys.postScores(postId);
            const hSetKey = this.keys.winHistory(postId);

            //const oldScores = await this.redis.zRange(zRangeKey, 0, -1);
            const newScores = await this.redis.hGet(hSetKey, 'loggedSolves');

            //console.log('old scores:', oldScores);
            console.log('new scores:', newScores);
            //for each item in oldScores, create a new WinData object with member being saved as username and score being saved as score
            /*const oldWinData = oldScores.map(score => {
                return {
                    username: score.member,
                    date: Date.now().toString(),
                    numGuesses: "1",
                    score: score.score,
                };
            });
            console.log('old win data:', oldWinData);*/
            //for each item in oldWinData, push it onto newScores
            const newWinData = newScores ? JSON.parse(newScores) : [];
            console.log('new win data:', newWinData);
            /*oldWinData.forEach(score => {
                newWinData.push(score);
            });
            console.log('merged data:', newWinData);
            //store newWinData in hSetKey
            await this.redis.hSet(hSetKey, {
                loggedSolves: JSON.stringify(newWinData),
            });
            console.log('saved merged data')*/
            
            //return newWinData
            const result = newWinData.map((score: WinData) => {
                return {
                    username: score.username,
                    date: score.date,
                    numGuesses: score.numGuesses,
                    score: score.score,
                };
            });
            console.log('returning win data: ', result);

            return result;

        } catch (error) {
            console.error('Failed to get scores:', error);
            throw error;
        }
    }

    //for each username, get all the posts they have made
    async getUserPosts(username: string): Promise<string[]> {
        try{
            const key = this.keys.userData(username);
            const postIds = await this.redis.hGet(key, 'authoredPosts');
            return postIds ? JSON.parse(postIds) : [];
        } catch (error) {
            console.error('Failed to get user posts:', error);
            throw error;
    }}

    //get all user data
    async getUserData(username: string): Promise<UserData> {
        try {
            const key = this.keys.userData(username);
            const data = await this.redis.hGetAll(key);
            return {
                userId: data.username,
                authoredPosts: data.authoredPosts ? JSON.parse(data.authoredPosts) : [],
                solvedPosts: data.solvedPosts ? JSON.parse(data.solvedPosts) : [],
                points: data.points ? JSON.parse(data.points) : [],
            };
        } catch (error) {
            console.error('Failed to get user data:', error);
            throw error;
        }
    }    
    

    async getTopScorers(): Promise<{scorer:string[], score:number[]}> {
        try{
            const guessers = await this.redis.zRange(this.keys.clueSolvers(), 0, -1);
            const guesserPoints = await Promise.all(guessers.map(async guesser => {
                const key = this.keys.userData(guesser.member);
                const data = await this.redis.hGet(key, 'points');
                return data ? JSON.parse(data).reduce((acc: number, score: number) => acc + score, 0) : 0;
            }));
            //return top 5 scorers and scores
            const topScorers = guessers.map((guesser, index) => ({
                scorer: guesser.member,
                score: guesserPoints[index],
            })).sort((a, b) => b.score - a.score).slice(0, 5);
            return {
                scorer: topScorers.map(topScorer => topScorer.scorer),
                score: topScorers.map(topScorer => topScorer.score),
            };
        } catch (error) {
            console.error('Failed to get top scorer:', error);
            throw error;
        }
    }

    //get posts completed by user
    async hasSolved(data: {username: string, postId: string}): Promise<boolean> {
        try {
            const key = this.keys.userData(data.username);
            const postlist = await this.redis.hGet(key, 'solvedPosts');
            const solvedPosts = postlist ? JSON.parse(postlist) : [];
            return solvedPosts.includes(data.postId);
        } catch (error) {
            console.error('Failed to get solved posts:', error);
            throw error;
        }
    }

}

// types
export type PostData = {
    postId: string;
    clue: string;
    solution: string;
    explanation: string;
}

export type UserData = {
    userId: string;
    authoredPosts: string[];
    solvedPosts: string[];
    points: number[];
}

export type WinData = {
    username: string;
    date: string;
    numGuesses: number;
    score: number;
}