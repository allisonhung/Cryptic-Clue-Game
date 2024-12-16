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
        postData: (postId: string) => `post:${postId}`,
        userPosts: (userId: string) => `user-posts:${userId}`,
        userData: (userId: string) => `user-data:${userId}`,
        postScores: (postId: string) => `post-scores:${postId}`,
        postGuesses: (postId: string) => `post-guesses:${postId}`,
        clueAuthors: () => 'clue-authors',
    }

  async submitClue(data: {
        postId: string;
        clue: string;
        wordCount: number;
        words: string[];
        colors: string[];
        correctCells: number[];
        authorId: string;
    }): Promise<void> {
        if (!this.scheduler || !this.reddit) {
            console.error('Scheduler or Reddit API not available');
            return;
        }
        const key = this.keys.postData(data.postId);
        await Promise.all([
            this.redis.hSet(key, {
                postId: data.postId,
                clue: data.clue,
                wordCount: data.wordCount.toString(),
                words: data.words.join(','),
                colors: data.colors.join(','),
                correctCells: JSON.stringify(data.correctCells),
                authorId: data.authorId,
            }),
            this.redis.zAdd(this.keys.userPosts(data.authorId),{
                member: data.postId,
                score: Date.now(),
            }),
            this.redis.zAdd(this.keys.postScores(data.postId),{
                member: data.authorId,
                score: 0,
            }),
            this.redis.zAdd(this.keys.clueAuthors(), {
                member: data.authorId,
                score: Date.now(), 
    }),
]);
        console.log('Clue submitted:', data);
    }
    async getClue(postId: string): Promise<[string, number, string, string[], string[], number[], string]> {
        try {
            const key = this.keys.postData(postId);
            const data = await this.redis.hGetAll(key);
            
            if (!data || !data.clue) {
                throw new Error(`No clue found for post ${postId}`);
            }
    
            return [
                data.clue,
                parseInt(data.wordCount, 10),
                data.postId,
                data.words.split(','),
                data.colors.split(','),
                JSON.parse(data.correctCells),
                data.authorId,
            ];
        } catch (error) {
            console.error('Failed to get clue data:', error);
            throw error;
        }
    }
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
            const key = this.keys.postScores(data.postId);
            await this.redis.zAdd(key, {
                member: data.username, 
                score: data.score,
            });
            await this.redis.zAdd(this.keys.postGuesses(data.postId), {
                member: data.username,
                score: data.score,
            });
            //console.log('post score added:', data);
        } catch (error) {
            console.error('Failed to add guess:', error);
            throw error;
    }}

    async getAllUsers(): Promise<string[]> {
        try {
            const authors = await this.redis.zRange(this.keys.clueAuthors(), 0, -1);
            return authors.map(author => author.member);
        } catch (error) {
            console.error('Failed to get all users:', error);
            throw error;
        }
    }

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
    async getGuesses(postId: string): Promise<{username: string, score: number}[]> {
        try {
            const key = this.keys.postGuesses(postId);
            const guesses = await this.redis.zRange(key, 0, -1);
            return guesses.map(guess => ({
                username: guess.member,
                score: guess.score,
            }));
        } catch (error) {
            console.error('Failed to get guesses:', error);
            throw error;
        }
    }
    async getUserPosts(username: string): Promise<string[]> {
        try{
            const key = this.keys.userPosts(username);
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
    wordCount: number;
    words: string[];
    colors: string[];
    correctCells: number[];
}

export type UserData = {
    userId: string;
}