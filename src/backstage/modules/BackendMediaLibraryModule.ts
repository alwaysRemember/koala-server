/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-15 17:07:00
 * @LastEditTime: 2020-07-22 11:31:46
 * @FilePath: /koala-server/src/backstage/modules/BackendMediaLibraryModule.ts
 */
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMediaLibrary } from '../../global/dataobject/ProductMediaLibrary.entity';
import { ProductMediaLibraryRepository } from '../../global/repository/ProductMediaLibraryRepository';
import { BackendMediaLibraryController } from '../controller/BackendMediaLibraryController';
import { Module } from '@nestjs/common';
import { Product } from 'src/global/dataobject/Product.entity';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { BackendMediaLibraryService } from '../service/BackendMediaLibraryService';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductMediaLibrary,
      ProductMediaLibraryRepository,
    ]),
    TypeOrmModule.forFeature([Product, ProductRepository]),
  ],
  controllers: [BackendMediaLibraryController],
  providers: [BackendMediaLibraryService],
})
export class BackendMediaLibraryModule {}
