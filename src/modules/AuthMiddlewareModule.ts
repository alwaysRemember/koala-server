/*
 * 权限校验module
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 17:03:49
 * @LastEditTime: 2020-06-18 16:02:00
 * @FilePath: /koala-background-server/src/modules/AuthMiddlewareModule.ts
 */
import { NestModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { BackgroundLoginMiddleware } from 'src/middleware/AuthMiddleware';
import { BackendUserController } from 'src/controller/BackendUserController';
import { RedisCacheServiceImpl } from 'src/service/impl/RedisCacheServiceImpl';
import { BackendUserRepository } from 'src/repository/BackendUserRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackendUser } from 'src/dataobject/BackendUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BackendUser, BackendUserRepository])],
  providers: [RedisCacheServiceImpl],
})
export class AuthMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BackgroundLoginMiddleware)
      .exclude('/backend-user/login')
      .forRoutes(BackendUserController);
  }
}
