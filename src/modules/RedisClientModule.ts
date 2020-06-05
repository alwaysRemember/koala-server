/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 15:30:16
 * @LastEditTime: 2020-06-05 16:51:38
 * @FilePath: /koala-background-server/src/modules/RedisClientModule.ts
 */
import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { RedisConfig } from 'src/config/RedisConfig';

const redis = RedisModule.register(RedisConfig);

@Module({
  imports: [redis],
  exports: [redis],
})
export class RedisClientModule {}
