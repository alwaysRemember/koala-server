/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 17:37:42
 * @LastEditTime: 2020-07-20 17:58:20
 * @FilePath: /koala-server/src/backstage/modules/BackendCategoriesModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from '../../global/dataobject/Categories.entity';
import { BackendCategoriesController } from '../controller/BackendCategoriesController';
import { BackendCategoriesServiceImpl } from '../service/impl/BackendCategoriesServiceImpl';
import { CategoriesRepository } from '../../global/repository/CategoriesRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Categories, CategoriesRepository])],
  controllers: [BackendCategoriesController],
  providers: [BackendCategoriesServiceImpl],
  exports: [
    TypeOrmModule.forFeature([Categories, CategoriesRepository]),
    BackendCategoriesServiceImpl,
  ],
})
export class BackendCategoriesModule {}
