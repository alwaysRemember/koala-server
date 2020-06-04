/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 17:01:33
 * @LastEditTime: 2020-06-02 12:10:02
 * @FilePath: /koala-background-server/src/Application.ts
 */

import { NestModule, Module, MiddlewareConsumer } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysqlConfig from './config/MysqlConfig';
import { LoggerMiddleware } from './middleware/LoggerMiddleware';
import { BackgroundLoginMiddleware } from './middleware/AuthMiddleware';
import { BackendUserModule } from './modules/BackendUserModule';
import { BackendUserController } from './controller/BackendUserController';
@Module({
  imports: [TypeOrmModule.forRoot(mysqlConfig), BackendUserModule],
})
export default class Application implements NestModule {
  constructor(private readonly connection: Connection) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
      .apply(BackgroundLoginMiddleware)
      .forRoutes(BackendUserController);
  }
}
