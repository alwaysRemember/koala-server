/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-05 16:04:35
 * @LastEditTime: 2020-08-13 14:46:35
 * @FilePath: /koala-server/src/frontend/modules/FrontAuthMiddlewareModule.ts
 */
import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';
import { FrontUserController } from '../controller/FrontUserController';
import { FrontAuthMiddleware } from '../middleware/FrontAuthMiddleware';
import { FrontHomeController } from '../controller/FrontHomeController';

@Module({})
export class FrontAuthMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FrontAuthMiddleware)
      .exclude('/api/front/login')
      .forRoutes(FrontUserController,FrontHomeController);
  }
}
