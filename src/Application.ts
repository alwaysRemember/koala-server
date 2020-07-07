/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 17:01:33
 * @LastEditTime: 2020-07-07 18:36:50
 * @FilePath: /koala-server/src/Application.ts
 */

import { NestModule, Module, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './global/middleware/LoggerMiddleware';
import { MysqlModule } from './global/modules/MysqlModule';
import { BackendControllerModule } from './backstage/modules/BackendControllerModule';
import { RedisClientModule } from './global/modules/RedisClientModule';
import { BackendAuthMiddlewareModule } from './backstage/modules/BackendAuthMiddlewareModule';
import { FrontControllerModule } from './frontend/modules/FrontControllerModule';
@Module({
  imports: [
    BackendAuthMiddlewareModule,
    MysqlModule,
    RedisClientModule,
    BackendControllerModule,
    FrontControllerModule,
  ],
})
export default class Application implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
