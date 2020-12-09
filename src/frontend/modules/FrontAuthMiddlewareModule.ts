/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-05 16:04:35
 * @LastEditTime: 2020-12-09 12:11:33
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
import { FrontShoppingCartController } from '../controller/FrontShoppingCartController';

@Module({})
export class FrontAuthMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FrontAuthMiddleware)
      .exclude('/api/front/login', '/api/front/home/get-home-data')
      .forRoutes(
        FrontUserController,
        FrontHomeController,
        FrontShoppingAddressController,
        FrontOrderController,
        FrontFavoritesController,
        FrontCategoriesController,
        FrontShoppingCartController,
      );
  }
}
