/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 17:37:42
 * @LastEditTime: 2020-07-07 18:19:02
 * @FilePath: /koala-server/src/backstage/modules/BackendCategoriesModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from '../../global/dataobject/Categories.entity';
import { BackendCategoriesController } from '../controller/BackendCategoriesController';
import { BackendCategoriesServiceImpl } from '../service/impl/BackendCategoriesServiceImpl';
import { ClassificationRepository } from '../../global/repository/ClassificationRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Categories, ClassificationRepository])],
  controllers: [BackendCategoriesController],
  providers: [BackendCategoriesServiceImpl],
})
export class BackendCategoriesModule {}
