/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-01 18:49:34
 * @LastEditTime: 2020-09-27 14:46:58
 * @FilePath: /koala-server/src/backstage/modules/BackendUserModule.ts
 */
import { Module } from '@nestjs/common';
import { BackendUserController } from 'src/backstage/controller/BackendUserController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { BackendUserRepository } from 'src/backstage/repository/BackendUserRepository';
import { BackendUserService } from '../service/BackendUserService';
import { RedisCacheService } from '../service/RedisCacheService';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BackendUser, BackendUserRepository]),
    TypeOrmModule.forFeature([FrontUser, FrontUserRepository]),
  ],
  controllers: [BackendUserController],
  providers: [BackendUserService, RedisCacheService],
  exports: [
    TypeOrmModule.forFeature([BackendUser, BackendUserRepository]),
    BackendUserService,
  ],
})
export class BackendUserModule {}
