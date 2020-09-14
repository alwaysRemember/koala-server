/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-22 17:37:53
 * @LastEditTime: 2020-09-14 16:57:36
 * @FilePath: /koala-server/src/frontend/modules/FrontUserModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrontUser } from '../../global/dataobject/User.entity';
import { FrontUserRepository } from '../../global/repository/FrontUserRepository';
import { FrontUserController } from '../controller/FrontUserController';
import { FrontUserService } from '../service/UserService';

@Module({
  imports: [TypeOrmModule.forFeature([FrontUser, FrontUserRepository])],
  controllers: [FrontUserController],
  providers: [FrontUserService],
  exports:[FrontUserService]
})
export class FrontUserModule {}
