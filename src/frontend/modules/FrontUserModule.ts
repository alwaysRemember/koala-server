/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-22 17:37:53
 * @LastEditTime: 2020-11-16 14:43:56
 * @FilePath: /koala-server/src/frontend/modules/FrontUserModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/global/dataobject/Order.entity';
import { ProductComment } from 'src/global/dataobject/ProductComment.entity';
import { ProductMainImg } from 'src/global/dataobject/ProductMainImg.entity';
import { OrderRepository } from 'src/global/repository/OrderRepository';
import { ProductCommentReposiotry } from 'src/global/repository/ProductCommentReposiotry';
import { ProductMainImgRepository } from 'src/global/repository/ProductMainImgRepository';
import { FrontUser } from '../../global/dataobject/User.entity';
import { FrontUserRepository } from '../../global/repository/FrontUserRepository';
import { FrontUserController } from '../controller/FrontUserController';
import { FrontUserService } from '../service/UserService';

@Module({
  imports: [
    TypeOrmModule.forFeature([FrontUser, FrontUserRepository]),
    TypeOrmModule.forFeature([Order, OrderRepository]),
    TypeOrmModule.forFeature([ProductComment, ProductCommentReposiotry]),
    TypeOrmModule.forFeature([ProductMainImg, ProductMainImgRepository]),
  ],
  controllers: [FrontUserController],
  providers: [FrontUserService],
  exports: [FrontUserService],
})
export class FrontUserModule {}
