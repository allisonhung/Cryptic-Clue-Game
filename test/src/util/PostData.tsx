import type {
    Post,
    RedditAPIClient,
    RedisClient,
    Scheduler,
    ZRangeOptions,
  } from '@devvit/public-api';
import { Devvit } from '@devvit/public-api';

export class PostData {
    readonly redis: RedisClient;
  readonly reddit?: RedditAPIClient;
  readonly scheduler?: Scheduler;

  constructor(context: { redis: RedisClient; reddit?: RedditAPIClient; scheduler?: Scheduler }) {
    this.redis = context.redis;
    this.reddit = context.reddit;
    this.scheduler = context.scheduler;
  }

  readonly keys = {
    postData: (postId: string) => `post:${postId}:data`,
    clue: (postId: string) => `post:${postId}:clue`,
    wordCount: (postId: string) => `post:${postId}:wordcount`,
  }

  async submitClue(data: {
    postId: string;
    clue: string;
    wordCount: number;
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
        })
    ])
    }
    async getClue(postId: string): Promise<[string, number, string]> {
        try {
            const key = this.keys.postData(postId);
            const data = await this.redis.hGetAll(key);
            
            if (!data || !data.clue) {
                throw new Error(`No clue found for post ${postId}`);
            }
    
            return [
                data.clue,
                parseInt(data.wordCount, 10),
                data.postId
            ];
        } catch (error) {
            console.error('Failed to get clue data:', error);
            throw error;
        }
    }

}