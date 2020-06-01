/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 17:01:33
 * @LastEditTime: 2020-06-01 18:06:49
 * @FilePath: /koala_background_server/src/Application.ts
 */

import { NestModule, Module, MiddlewareConsumer } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/UserModule';
import mysqlConfig from './config/MysqlConfig';
import { LoggerMiddleware } from './middleware/LoggerMiddleware';
import { BackgroundLoginMiddleware } from './middleware/AuthMiddleware';
import { UserController } from './controller/UserController';

@Module({
  imports: [TypeOrmModule.forRoot(mysqlConfig), UserModule],
})
export default class Application implements NestModule {
  constructor(private readonly connection: Connection) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
      .apply(BackgroundLoginMiddleware)
      .forRoutes(UserController);
  }
}
