/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:10:50
 * @LastEditTime: 2020-10-15 19:09:21
 * @FilePath: /koala-server/src/frontend/modules/FrontOrderMOdule.ts
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/global/dataobject/Order.entity';
import { PayOrder } from 'src/global/dataobject/PayOrder.entity';
import { Product } from 'src/global/dataobject/Product.entity';
import { ProductConfig } from 'src/global/dataobject/ProductConfig.entity';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { ProductMainImg } from 'src/global/dataobject/ProductMainImg.entity';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { OrderRepository } from 'src/global/repository/OrderRepository';
import { PayOrderRepository } from 'src/global/repository/PayOrderRepository';
import { ProductConfigRepository } from 'src/global/repository/ProductConfigRepository';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { ProductMainImgRepository } from 'src/global/repository/ProductMainImgRepository';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { OrderTasksService } from 'src/global/service/OrderTasksService';
import { FrontOrderController } from '../controller/FrontOrderController';
import { ShoppingAddress } from '../dataobject/ShoppingAddress.entity';
import { ShoppingAddressRepository } from '../repository/ShoppingAddressRepository';
import { OrderService } from '../service/OrderService';
import { FrontUserService } from '../service/UserService';
import { FrontUserModule } from './FrontUserModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderRepository]),
    TypeOrmModule.forFeature([PayOrder, PayOrderRepository]),
    TypeOrmModule.forFeature([ShoppingAddress, ShoppingAddressRepository]),
    TypeOrmModule.forFeature([Product, ProductRepository]),
    TypeOrmModule.forFeature([ProductDetail, ProductDetailRepository]),
    TypeOrmModule.forFeature([FrontUser, FrontUserRepository]),
    TypeOrmModule.forFeature([ProductConfig, ProductConfigRepository]),
    TypeOrmModule.forFeature([ProductMainImg,ProductMainImgRepository]),
    FrontUserModule,
  ],
  providers: [OrderService, OrderTasksService],
  controllers: [FrontOrderController],
})
export class FrontOrderModule {}
