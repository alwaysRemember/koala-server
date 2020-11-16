/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-16 18:03:27
 * @LastEditTime: 2020-11-16 18:11:33
 * @FilePath: /koala-server/src/frontend/modules/FrontCategoriesModule.ts
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from 'src/global/dataobject/Categories.entity';
import { CategoriesRepository } from 'src/global/repository/CategoriesRepository';
import { FrontCategoriesController } from '../controller/FrontCategoritesController';
import { CategoriesService } from '../service/CategoriesService';

@Module({
  imports: [TypeOrmModule.forFeature([Categories, CategoriesRepository])],
  providers: [CategoriesService],
  controllers: [FrontCategoriesController],
})
export class FrontCategoriesModule {}
