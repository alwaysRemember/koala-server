/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 17:01:33
 * @LastEditTime: 2020-12-07 18:49:43
 * @FilePath: /koala-server/src/Application.ts
 */
import { join } from 'path';
import { NestModule, Module, MiddlewareConsumer } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerMiddleware } from './global/middleware/LoggerMiddleware';
import { MysqlModule } from './global/modules/MysqlModule';
import { BackendControllerModule } from './backstage/modules/BackendControllerModule';
import { RedisClientModule } from './global/modules/RedisClientModule';
import { BackendAuthMiddlewareModule } from './backstage/modules/BackendAuthMiddlewareModule';
import { FrontControllerModule } from './frontend/modules/FrontControllerModule';
import { FrontAuthMiddlewareModule } from './frontend/modules/FrontAuthMiddlewareModule';
import { wxPayModule } from './global/modules/WxPayModule';
import { ExperssModule } from './global/modules/ExpressModule';
@Module({
  imports: [
    BackendAuthMiddlewareModule,
    FrontAuthMiddlewareModule,
    MysqlModule,
    RedisClientModule,
    BackendControllerModule,
    FrontControllerModule,
    wxPayModule,
    ExperssModule,
    ScheduleModule.forRoot(),
  ],
})
export default class Application implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
