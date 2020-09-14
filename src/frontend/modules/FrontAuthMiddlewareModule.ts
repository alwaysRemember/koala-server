/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-05 16:04:35
 * @LastEditTime: 2020-09-14 15:21:57
 * @FilePath: /koala-server/src/frontend/modules/FrontAuthMiddlewareModule.ts
 */
import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';
import { FrontUserController } from '../controller/FrontUserController';
import { FrontAuthMiddleware } from '../middleware/FrontAuthMiddleware';
import { FrontHomeController } from '../controller/FrontHomeController';
import { FrontShoppingAddressController } from '../controller/FrontShoppingAddressController';

@Module({})
export class FrontAuthMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FrontAuthMiddleware)
      .exclude('/api/front/login')
      .forRoutes(
        FrontUserController,
        FrontHomeController,
        FrontShoppingAddressController,
      );
  }
}
