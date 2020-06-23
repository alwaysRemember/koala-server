/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-22 17:37:53
 * @LastEditTime: 2020-06-23 15:43:56
 * @FilePath: /koala-background-server/src/global/modules/FrontUserModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrontUser } from '../dataobject/FrontUser.entity';
import { FrontUserRepository } from '../repository/FrontUserRepository';
import { Logincontroller } from '../../frontend/controller/FrontUserController';
import { FrontUserServiceImpl } from '../service/impl/FrontUserServiceImpl';

@Module({
  imports: [TypeOrmModule.forFeature([FrontUser, FrontUserRepository])],
  controllers: [Logincontroller],
  providers: [FrontUserServiceImpl],
})
export class LoginModule {}
