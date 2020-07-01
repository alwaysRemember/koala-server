/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 17:37:42
 * @LastEditTime: 2020-07-01 18:24:09
 * @FilePath: /koala-background-server/src/backstage/modules/BackendClassificationModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackendClassification } from '../dataobject/BackendClassification.entity';
import { BackendUserRepository } from '../repository/BackendUserRepository';
import { BackendClassificationController } from '../controller/BackendClassificationController';
import { BackendClassificationServiceImpl } from '../service/impl/BackendClassificationServiceImpl';

@Module({
  imports: [
    TypeOrmModule.forFeature([BackendClassification, BackendUserRepository]),
  ],
  controllers: [BackendClassificationController],
  providers: [BackendClassificationServiceImpl],
})
export class BackendClassificationModule {}
