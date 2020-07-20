/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:19:21
 * @LastEditTime: 2020-07-20 13:59:03
 * @FilePath: /koala-server/src/backstage/modules/BackendProductModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBanner } from 'src/global/dataobject/ProductBanner.entity';
import { ProductBannerRepository } from 'src/global/repository/ProductBannerRepository';
import { BackendProductDetailController } from '../controller/BackendProductDetailController';
import { BackendProductDetailServiceImpl } from '../service/impl/BackendProductDetailServiceImpl';
import { ProductVideo } from 'src/global/dataobject/ProductVideo.entity';
import { ProductVideoRepository } from 'src/global/repository/ProductVideoRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductBanner, ProductBannerRepository]),
    TypeOrmModule.forFeature([ProductVideo, ProductVideoRepository]),
  ],
  controllers: [BackendProductDetailController],
  providers: [BackendProductDetailServiceImpl],
})
export class BackendProductModule {}
