/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 15:45:53
 * @LastEditTime: 2020-07-22 11:26:44
 * @FilePath: /koala-server/src/backstage/service/RedisCacheService.ts
 */
import { Redis } from 'ioredis';
import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class RedisCacheService {
  public client: Redis;
  constructor(private readonly redisService: RedisService) {}

  async getClient(): Promise<Redis> {
    this.client = await this.redisService.getClient();
    return this.client;
  }

  async set(key: string, value: string, seconds?: number) {
    if (!this.client) {
      await this.getClient();
    }
    if (seconds) {
      await this.client.set(key, value, 'EX', seconds);
    } else {
      await this.client.set(key, value);
    }
  }
  async get(key: string): Promise<string> {
    if (!this.client) {
      await this.getClient();
    }
    return await this.client.get(key);
  }

  async delete(key: string) {
    if (!this.client) {
      await this.getClient();
    }
    await this.client.del(key);
  }
}
