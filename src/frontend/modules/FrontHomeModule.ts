/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-13 14:43:52
 * @LastEditTime: 2020-12-07 14:55:17
 * @FilePath: /koala-server/src/frontend/modules/FrontHomeModule.ts
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppletHomeBanner } from 'src/global/dataobject/AppletHomeBanner.entity';
import { AppletHomeBannerRepository } from 'src/global/repository/AppletHomeBannerRepository';
import { AppletHomeBannerImg } from 'src/global/dataobject/AppletHomeBannerImg.entity';
import { AppletHomeBannerImgReposioty } from 'src/global/repository/AppletHomeBannerImgReposioty';
import { HomeService } from '../service/HomeService';
import { FrontHomeController } from '../controller/FrontHomeController';
import { Categories } from 'src/global/dataobject/Categories.entity';
import { CategoriesRepository } from 'src/global/repository/CategoriesRepository';
import { Product } from 'src/global/dataobject/Product.entity';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppletHomeBanner, AppletHomeBannerRepository]),
    TypeOrmModule.forFeature([Categories, CategoriesRepository]),
    TypeOrmModule.forFeature([Product, ProductRepository]),
    TypeOrmModule.forFeature([FrontUser, FrontUserRepository]),
  ],
  controllers: [FrontHomeController],
  providers: [HomeService],
})
export class FrontHomeModule {}
