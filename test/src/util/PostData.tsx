import type {
    RedditAPIClient,
    RedisClient,
    Scheduler,
  } from '@devvit/public-api';

export class PostData {
    readonly redis: RedisClient;
    readonly reddit?: RedditAPIClient;
    readonly scheduler?: Scheduler;

    constructor(context: { redis: RedisClient; reddit?: RedditAPIClient; scheduler?: Scheduler }) {
    this.redis = context.redis;
    this.reddit = context.reddit;
    this.scheduler = context.scheduler;
    }

  private getKey(postId: string){
    return `post:${postId}`;
  }

  async submitClue(data: {
    postId: string;
    clue: string;
    wordCount: number;
    words: string[];
    colors: string[];
  }): Promise<void> {
    if (!this.scheduler || !this.reddit) {
        console.error('Scheduler or Reddit API not available');
        return;
    }
    const key = this.getKey(data.postId);

    await this.redis.hSet(key, {
            postId: data.postId,
            clue: data.clue,
            wordCount: data.wordCount.toString(),
            words: data.words.join(','),
            colors: data.colors.join(','),
        });
    }
    async getClue(postId: string): Promise<[string, number, string, string[], string[]]> {
        try {
            const key = this.getKey(postId);
            const data = await this.redis.hGetAll(key);
            
            if (!data || !data.clue) {
                throw new Error(`No clue found for post ${postId}`);
            }
    
            return [
                data.clue,
                parseInt(data.wordCount, 10),
                data.postId,
                data.words.split(','),
                data.colors.split(',')
            ];
        } catch (error) {
            console.error('Failed to get clue data:', error);
            throw error;
        }
    }

}