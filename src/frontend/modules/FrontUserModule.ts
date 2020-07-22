/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-22 17:37:53
 * @LastEditTime: 2020-07-22 11:32:21
 * @FilePath: /koala-server/src/frontend/modules/FrontUserModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrontUser } from '../../global/dataobject/User.entity';
import { FrontUserRepository } from '../../global/repository/FrontUserRepository';
import { Logincontroller } from '../controller/FrontUserController';
import { FrontUserService } from '../service/UserService';

@Module({
  imports: [TypeOrmModule.forFeature([FrontUser, FrontUserRepository])],
  controllers: [Logincontroller],
  providers: [FrontUserService],
})
export class FrontUserModule {}
