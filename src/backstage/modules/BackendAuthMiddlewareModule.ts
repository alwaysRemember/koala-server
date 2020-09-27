/*
 * 权限校验module
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 17:03:49
 * @LastEditTime: 2020-09-27 14:45:20
 * @FilePath: /koala-server/src/backstage/modules/BackendAuthMiddlewareModule.ts
 */
import { NestModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { BackgroundLoginMiddleware } from 'src/backstage/middleware/AuthMiddleware';
import { BackendUserController } from 'src/backstage/controller/BackendUserController';
import { BackendUserRepository } from 'src/backstage/repository/BackendUserRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { BackendCategoriesController } from '../controller/BackendCategoriesController';
import { BackendAppletUsersController } from '../controller/BackendAppletUsersController';
import { BackendMediaLibraryController } from '../controller/BackendMediaLibraryController';
import { BackendProductDetailController } from '../controller/BackendProductDetailController';
import { RedisCacheService } from '../service/RedisCacheService';
import { BackendProductListController } from '../controller/BackendProductListController';
import { BackendAppletHomeController } from '../controller/BackendAppletHomeController';
import { BackendOrderController } from '../controller/BackendOrderController';

@Module({
  imports: [TypeOrmModule.forFeature([BackendUser, BackendUserRepository])],
  providers: [RedisCacheService],
})
export class BackendAuthMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BackgroundLoginMiddleware)
      .exclude('/api/backend-user/login')
      .forRoutes(
        BackendUserController,
        BackendCategoriesController,
        BackendAppletUsersController,
        BackendMediaLibraryController,
        BackendProductDetailController,
        BackendProductListController,
        BackendAppletHomeController,
        BackendOrderController,
      );
  }
}
