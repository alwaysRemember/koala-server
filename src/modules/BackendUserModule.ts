/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-01 18:49:34
 * @LastEditTime: 2020-06-04 16:41:57
 * @FilePath: /koala-background-server/src/modules/BackendUserModule.ts
 */
import { Module } from '@nestjs/common';
import { BackendUserController } from 'src/controller/BackendUserController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackendUser } from 'src/dataobject/BackendUser.entity';
import { BackendUserRepository } from 'src/repository/BackendUserRepository';
import { BackendUserServiceImpl } from 'src/service/impl/BackendUserServiceImpl';

@Module({
  imports: [TypeOrmModule.forFeature([BackendUser, BackendUserRepository])],
  controllers: [BackendUserController],
  providers: [BackendUserServiceImpl],
})
export class BackendUserModule {}
