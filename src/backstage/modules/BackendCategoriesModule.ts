/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 17:37:42
 * @LastEditTime: 2020-07-22 11:29:43
 * @FilePath: /koala-server/src/backstage/modules/BackendCategoriesModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from '../../global/dataobject/Categories.entity';
import { BackendCategoriesController } from '../controller/BackendCategoriesController';
import { CategoriesRepository } from '../../global/repository/CategoriesRepository';
import { BackendCategoriesService } from '../service/BackendCategoriesService';

@Module({
  imports: [TypeOrmModule.forFeature([Categories, CategoriesRepository])],
  controllers: [BackendCategoriesController],
  providers: [BackendCategoriesService],
  exports: [
    TypeOrmModule.forFeature([Categories, CategoriesRepository]),
    BackendCategoriesService,
  ],
})
export class BackendCategoriesModule {}
