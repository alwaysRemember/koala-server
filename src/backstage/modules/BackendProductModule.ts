/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:19:21
 * @LastEditTime: 2020-07-17 15:26:04
 * @FilePath: /koala-server/src/backstage/modules/BackendProductModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBanner } from 'src/global/dataobject/ProductBanner.entity';
import { ProductBannerRepository } from 'src/global/repository/ProductBannerRepository';
import { BackendProductController } from '../controller/BackendProductController';
import { BackendProductServiceImpl } from '../service/impl/BackendProductServiceImpl';

@Module({
  imports: [TypeOrmModule.forFeature([ProductBanner, ProductBannerRepository])],
  controllers: [BackendProductController],
  providers: [BackendProductServiceImpl],
})
export class BackendProductModule {}
