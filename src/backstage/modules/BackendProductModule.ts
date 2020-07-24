/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:19:21
 * @LastEditTime: 2020-07-24 16:04:15
 * @FilePath: /koala-server/src/backstage/modules/BackendProductModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBanner } from 'src/global/dataobject/ProductBanner.entity';
import { ProductBannerRepository } from 'src/global/repository/ProductBannerRepository';
import { BackendProductDetailController } from '../controller/BackendProductDetailController';
import { ProductVideo } from 'src/global/dataobject/ProductVideo.entity';
import { ProductVideoRepository } from 'src/global/repository/ProductVideoRepository';
import { BackendUserModule } from './BackendUserModule';
import { BackendCategoriesModule } from './BackendCategoriesModule';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { ProductMediaLibrary } from 'src/global/dataobject/ProductMediaLibrary.entity';
import { ProductMediaLibraryRepository } from 'src/global/repository/ProductMediaLibraryRepository';
import { Product } from 'src/global/dataobject/Product.entity';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { BackendProductService } from '../service/BackendProductService';
import { RedisCacheService } from '../service/RedisCacheService';
import { BackendProductListController } from '../controller/BackendProductListController';

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
  controllers: [BackendProductDetailController, BackendProductListController],
  providers: [BackendProductService, RedisCacheService],
})
export class BackendProductModule {}
