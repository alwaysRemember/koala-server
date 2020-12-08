/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 15:27:07
 * @LastEditTime: 2020-12-07 19:46:59
 * @FilePath: /koala-server/prod_process.json
 */

export const RedisConfig = {
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  db: 0,
};
