/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-09 17:38:07
 * @LastEditTime: 2020-07-09 17:44:49
 * @FilePath: /koala-server/src/backstage/modules/BackendAppletUsersModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrontUser } from '../../global/dataobject/User.entity';
import { FrontUserRepository } from '../../global/repository/FrontUserRepository';
import { BackendAppletUsersServiceImpl } from '../service/impl/BackendAppletUsersServiceImpl';
import { BackendAppletUsersController } from '../controller/BackendAppletUsersController';

@Module({
  imports: [TypeOrmModule.forFeature([FrontUser, FrontUserRepository])],
  controllers: [BackendAppletUsersController],
  providers: [BackendAppletUsersServiceImpl],
})
export class BackendAppletUsersModule {}
