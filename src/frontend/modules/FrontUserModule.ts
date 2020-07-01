/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-22 17:37:53
 * @LastEditTime: 2020-07-01 18:41:02
 * @FilePath: /koala-background-server/src/global/modules/UserModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrontUser } from '../../global/dataobject/User.entity';
import { FrontUserRepository } from '../../global/repository/UserRepository';
import { Logincontroller } from '../controller/FrontUserController';
import { FrontUserServiceImpl } from '../service/impl/UserServiceImpl';

@Module({
  imports: [TypeOrmModule.forFeature([FrontUser, FrontUserRepository])],
  controllers: [Logincontroller],
  providers: [FrontUserServiceImpl],
})
export class FrontUserModule {}
