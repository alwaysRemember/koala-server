/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 15:35:47
 * @LastEditTime: 2020-06-05 15:56:56
 * @FilePath: /koala-background-server/src/service/RedisCacheService.ts
 */
import { Redis } from 'ioredis';

export interface RedisCacheService {
  getClient(): Promise<Redis>;

  set(key: string, value: string, seconds?: number);

  get(key: string): Promise<string>;
}
