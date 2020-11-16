/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:29:47
 * @LastEditTime: 2020-11-11 17:06:00
 * @FilePath: /koala-server/src/frontend/modules/FrontFavoritesModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { ProductMainImg } from 'src/global/dataobject/ProductMainImg.entity';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { UserFavorites } from 'src/global/dataobject/UserFavorites.entity';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { ProductMainImgRepository } from 'src/global/repository/ProductMainImgRepository';
import { UserFavoritseRepository } from 'src/global/repository/UserFavoritesRepository';
import { FrontFavoritesController } from '../controller/FrontFavoriesController';
import { FavoritesService } from '../service/FavoritesService';
import { FrontUserModule } from './FrontUserModule';

@Module({
  imports: [
    FrontUserModule,
    TypeOrmModule.forFeature([UserFavorites, UserFavoritseRepository]),
    TypeOrmModule.forFeature([ProductDetail,ProductDetailRepository]),
    TypeOrmModule.forFeature([ProductMainImg,ProductMainImgRepository])
  ],
  providers: [FavoritesService],
  controllers: [FrontFavoritesController],
})
export class FrontFavoritesModule {}
