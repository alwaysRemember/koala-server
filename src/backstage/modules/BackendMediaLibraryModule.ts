/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-15 17:07:00
 * @LastEditTime: 2020-07-15 18:43:50
 * @FilePath: /koala-server/src/backstage/modules/BackendMediaLibraryModule.ts
 */
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackendMediaLibrary } from '../dataobject/BackendMediaLibrary.entity';
import { BackendMediaLibraryRepository } from '../repository/BackendMediaLibraryRepository';
import { BackendMediaLibraryController } from '../controller/BackendMediaLibraryController';
import { Module } from '@nestjs/common';
import { BackendMediaLibraryServiceImpl } from '../service/impl/BackendMediaLibraryServiceImpl';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BackendMediaLibrary,
      BackendMediaLibraryRepository,
    ]),
  ],
  controllers: [BackendMediaLibraryController],
  providers: [BackendMediaLibraryServiceImpl],
})
export class BackendMediaLibraryModule {}
