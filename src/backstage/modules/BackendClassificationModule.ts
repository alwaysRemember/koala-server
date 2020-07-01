/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 17:37:42
 * @LastEditTime: 2020-07-01 18:48:25
 * @FilePath: /koala-background-server/src/backstage/modules/BackendClassificationModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classification } from '../../global/dataobject/Classification.entity';
import { BackendClassificationController } from '../controller/BackendClassificationController';
import { BackendClassificationServiceImpl } from '../service/impl/BackendClassificationServiceImpl';
import { ClassificationRepository } from '../../global/repository/ClassificationRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Classification, ClassificationRepository]),
  ],
  controllers: [BackendClassificationController],
  providers: [BackendClassificationServiceImpl],
})
export class BackendClassificationModule {}
