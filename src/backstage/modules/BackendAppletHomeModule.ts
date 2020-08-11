/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-07 15:49:41
 * @LastEditTime: 2020-08-11 14:02:43
 * @FilePath: /koala-server/src/backstage/modules/BackendAppletHomeModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppletHomeBanner } from 'src/global/dataobject/AppletHomeBanner.entity';
import { AppletHomeBannerRepository } from 'src/global/repository/AppletHomeBannerRepository';
import { AppletHomeBannerImg } from 'src/global/dataobject/AppletHomeBannerImg.entity';
import { AppletHomeBannerImgReposioty } from 'src/global/repository/AppletHomeBannerImgReposioty';
import { BackendAppletHomeController } from '../controller/BackendAppletHomeController';
import { BackendAppletHomeBannerService } from '../service/BackendAppletHomeBannerService';
import { Product } from 'src/global/dataobject/Product.entity';
import { ProductRepository } from 'src/global/repository/ProductRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppletHomeBanner, AppletHomeBannerRepository]),
    TypeOrmModule.forFeature([
      AppletHomeBannerImg,
      AppletHomeBannerImgReposioty,
    ]),
    TypeOrmModule.forFeature([Product, ProductRepository]),
  ],
  controllers: [BackendAppletHomeController],
  providers: [BackendAppletHomeBannerService],
})
export class BackendAppletHomeModule {}
