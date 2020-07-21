/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-15 17:07:00
 * @LastEditTime: 2020-07-21 16:17:57
 * @FilePath: /koala-server/src/backstage/modules/BackendMediaLibraryModule.ts
 */
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMediaLibrary } from '../../global/dataobject/ProductMediaLibrary.entity';
import { ProductMediaLibraryRepository } from '../../global/repository/ProductMediaLibraryRepository';
import { BackendMediaLibraryController } from '../controller/BackendMediaLibraryController';
import { Module } from '@nestjs/common';
import { BackendMediaLibraryServiceImpl } from '../service/impl/BackendMediaLibraryServiceImpl';
import { Product } from 'src/global/dataobject/Product.entity';
import { ProductRepository } from 'src/global/repository/ProductRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductMediaLibrary,
      ProductMediaLibraryRepository,
    ]),
    TypeOrmModule.forFeature([Product, ProductRepository]),
  ],
  controllers: [BackendMediaLibraryController],
  providers: [BackendMediaLibraryServiceImpl],
})
export class BackendMediaLibraryModule {}
