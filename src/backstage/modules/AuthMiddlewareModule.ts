/*
 * 权限校验module
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 17:03:49
 * @LastEditTime: 2020-07-01 18:19:23
 * @FilePath: /koala-background-server/src/backstage/modules/AuthMiddlewareModule.ts
 */
import { NestModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { BackgroundLoginMiddleware } from 'src/backstage/middleware/AuthMiddleware';
import { BackendUserController } from 'src/backstage/controller/BackendUserController';
import { RedisCacheServiceImpl } from 'src/backstage/service/impl/RedisCacheServiceImpl';
import { BackendUserRepository } from 'src/backstage/repository/BackendUserRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { BackendClassificationController } from '../controller/BackendClassificationController';

@Module({
  imports: [TypeOrmModule.forFeature([BackendUser, BackendUserRepository])],
  providers: [RedisCacheServiceImpl],
})
export class AuthMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BackgroundLoginMiddleware)
      .exclude('/backend-user/login')
      .forRoutes(BackendUserController, BackendClassificationController);
  }
}
