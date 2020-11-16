/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-05 16:04:35
 * @LastEditTime: 2020-11-16 18:11:24
 * @FilePath: /koala-server/src/frontend/modules/FrontAuthMiddlewareModule.ts
 */
import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';
import { FrontUserController } from '../controller/FrontUserController';
import { FrontAuthMiddleware } from '../middleware/FrontAuthMiddleware';
import { FrontHomeController } from '../controller/FrontHomeController';
import { FrontShoppingAddressController } from '../controller/FrontShoppingAddressController';
import { FrontOrderController } from '../controller/FrontOrderController';
import { FrontFavoritesController } from '../controller/FrontFavoriesController';
import { FrontCategoriesController } from '../controller/FrontCategoritesController';

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
        FrontOrderController,
        FrontFavoritesController,
        FrontCategoriesController,
      );
  }
}
