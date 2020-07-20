/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-01 18:49:34
 * @LastEditTime: 2020-07-20 17:56:46
 * @FilePath: /koala-server/src/backstage/modules/BackendUserModule.ts
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
  exports: [
    TypeOrmModule.forFeature([BackendUser, BackendUserRepository]),
    BackendUserServiceImpl,
  ],
})
export class BackendUserModule {}
