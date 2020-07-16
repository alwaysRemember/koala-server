/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-15 17:07:00
 * @LastEditTime: 2020-07-16 18:56:08
 * @FilePath: /koala-server/src/backstage/modules/BackendMediaLibraryModule.ts
 */
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMediaLibrary } from '../../global/dataobject/ProductMediaLibrary.entity';
import { ProductMediaLibraryRepository } from '../../global/repository/ProductMediaLibraryRepository';
import { BackendMediaLibraryController } from '../controller/BackendMediaLibraryController';
import { Module } from '@nestjs/common';
import { BackendMediaLibraryServiceImpl } from '../service/impl/BackendMediaLibraryServiceImpl';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductMediaLibrary,
      ProductMediaLibraryRepository,
    ]),
  ],
  controllers: [BackendMediaLibraryController],
  providers: [BackendMediaLibraryServiceImpl],
})
export class BackendMediaLibraryModule {}
