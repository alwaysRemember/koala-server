/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:19:21
 * @LastEditTime: 2020-07-21 17:09:11
 * @FilePath: /koala-server/src/backstage/modules/BackendProductDetailModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBanner } from 'src/global/dataobject/ProductBanner.entity';
import { ProductBannerRepository } from 'src/global/repository/ProductBannerRepository';
import { BackendProductDetailController } from '../controller/BackendProductDetailController';
import { BackendProductDetailServiceImpl } from '../service/impl/BackendProductDetailServiceImpl';
import { ProductVideo } from 'src/global/dataobject/ProductVideo.entity';
import { ProductVideoRepository } from 'src/global/repository/ProductVideoRepository';
import { RedisCacheServiceImpl } from '../service/impl/RedisCacheServiceImpl';
import { BackendUserModule } from './BackendUserModule';
import { BackendCategoriesModule } from './BackendCategoriesModule';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { ProductMediaLibrary } from 'src/global/dataobject/ProductMediaLibrary.entity';
import { ProductMediaLibraryRepository } from 'src/global/repository/ProductMediaLibraryRepository';
import { Product } from 'src/global/dataobject/Product.entity';
import { ProductRepository } from 'src/global/repository/ProductRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductBanner, ProductBannerRepository]),
    TypeOrmModule.forFeature([ProductVideo, ProductVideoRepository]),
    TypeOrmModule.forFeature([Product, ProductRepository]),
    TypeOrmModule.forFeature([ProductDetail, ProductDetailRepository]),
    TypeOrmModule.forFeature([
      ProductMediaLibrary,
      ProductMediaLibraryRepository,
    ]),
    BackendUserModule,
    BackendCategoriesModule,
  ],
  controllers: [BackendProductDetailController],
  providers: [
    BackendProductDetailServiceImpl,
    RedisCacheServiceImpl,
    BackendProductDetailServiceImpl,
  ],
})
export class BackendProductDetailModule {}
