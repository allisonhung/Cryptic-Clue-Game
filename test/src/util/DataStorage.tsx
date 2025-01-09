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
        const userData = await this.redis.hGet(data.authorId, 'authoredPosts');
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
        console.log('Clue submitted:', data);
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
    }): Promise<void> {
        if (!this.scheduler || !this.reddit) {
            console.error('Scheduler or Reddit API not available');
            return;
        }
        try {
            const key = this.keys.userData(data.username)

            const userData = await this.redis.hGet(key, 'solvedPosts');
            const solvedPosts = userData ? JSON.parse(userData) : [];
            solvedPosts.push(data.postId);

            //add the user's userId and their score to the post's scores
            await this.redis.zAdd(this.keys.userScores(data.postId), {
                member: data.username,
                score: data.score,
            });

            //add the post to the user's solved posts
            await this.redis.hSet(key, {
                solvedPosts: JSON.stringify(solvedPosts),
            });

            //add the user to the list of all clue solvers
            await this.redis.zAdd(this.keys.clueSolvers(), {
                member: data.username,
                score: Date.now(),
            });
            //console.log('post score added:', data);
        } catch (error) {
            console.error('Failed to add guess:', error);
            throw error;
    }}

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
    async getScores(postId: string): Promise<{username: string, score: number}[]> {
        try {
            const key = this.keys.postScores(postId);
            const scores = await this.redis.zRange(key, 0, -1);
            return scores.map(score => ({
                username: score.member,
                score: score.score,
            }));
        } catch (error) {
            console.error('Failed to get scores:', error);
            throw error;
        }
    }
    
    //for each username, get all the posts they have made
    async getUserPosts(username: string): Promise<string[]> {
        try{
            const key = this.keys.userData(username);
            const postIds = await this.redis.zRange(key, 0, -1);
            return postIds.map(post => post.member);
        } catch (error) {
            console.error('Failed to get user posts:', error);
            throw error;
    }}

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
}