/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-20 15:59:14
 * @LastEditTime: 2020-11-06 16:37:35
 * @FilePath: /koala-server/src/frontend/modules/FrontProductModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/global/dataobject/Product.entity';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { FrontProductController } from '../controller/FrontProductController';
import { ProductService } from '../service/ProductService';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { ProductMainImg } from 'src/global/dataobject/ProductMainImg.entity';
import { ProductMainImgRepository } from 'src/global/repository/ProductMainImgRepository';
import { Order } from 'src/global/dataobject/Order.entity';
import { OrderRepository } from 'src/global/repository/OrderRepository';
import { ProductComment } from 'src/global/dataobject/ProductComment.entity';
import { ProductCommentReposiotry } from 'src/global/repository/ProductCommentReposiotry';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductRepository]),
    TypeOrmModule.forFeature([ProductDetail, ProductDetailRepository]),
    TypeOrmModule.forFeature([FrontUser, FrontUserRepository]),
    TypeOrmModule.forFeature([ProductMainImg, ProductMainImgRepository]),
    TypeOrmModule.forFeature([Order, OrderRepository]),
    TypeOrmModule.forFeature([ProductComment, ProductCommentReposiotry]),
  ],
  controllers: [FrontProductController],
  providers: [ProductService],
})
export class FrontProductModule {}
