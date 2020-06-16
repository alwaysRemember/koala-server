/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 17:01:33
 * @LastEditTime: 2020-06-16 18:29:22
 * @FilePath: /koala-background-server/src/Application.ts
 */

import { NestModule, Module, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/LoggerMiddleware';
import { MysqlModule } from './modules/MysqlModule';
import { ControllerModule } from './modules/ControllerModule';
import { RedisClientModule } from './modules/RedisClientModule';
import { AuthMiddlewareModule } from './modules/AuthMiddlewareModule';
@Module({
  imports: [
    AuthMiddlewareModule,
    MysqlModule,
    RedisClientModule,
    ControllerModule,
  ],
})
export default class Application implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
