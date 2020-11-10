/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 15:27:07
 * @LastEditTime: 2020-11-10 11:43:46
 * @FilePath: /koala-server/src/config/RedisConfig.ts
 */

export const RedisConfig = {
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  db: 0,
};
