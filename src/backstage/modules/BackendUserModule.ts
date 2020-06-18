/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-01 18:49:34
 * @LastEditTime: 2020-06-05 16:47:15
 * @FilePath: /koala-background-server/src/modules/BackendUserModule.ts
 */
import { Module } from '@nestjs/common';
import { BackendUserController } from 'src/backstage/controller/BackendUserController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { BackendUserRepository } from 'src/backstage/repository/BackendUserRepository';
import { BackendUserServiceImpl } from 'src/backstage/service/impl/BackendUserServiceImpl';
import { RedisCacheServiceImpl } from 'src/backstage/service/impl/RedisCacheServiceImpl';

@Module({
  imports: [TypeOrmModule.forFeature([BackendUser, BackendUserRepository])],
  controllers: [BackendUserController],
  providers: [BackendUserServiceImpl, RedisCacheServiceImpl],
})
export class BackendUserModule {}
