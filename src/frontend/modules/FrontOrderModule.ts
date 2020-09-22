/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:10:50
 * @LastEditTime: 2020-09-22 17:43:01
 * @FilePath: /koala-server/src/frontend/modules/FrontOrderMOdule.ts
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/global/dataobject/Order.entity';
import { PayOrder } from 'src/global/dataobject/PayOrder.entity';
import { Product } from 'src/global/dataobject/Product.entity';
import { ProductConfig } from 'src/global/dataobject/ProductConfig.entity';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { OrderRepository } from 'src/global/repository/OrderRepository';
import { PayOrderRepository } from 'src/global/repository/PayOrderRepository';
import { ProductConfigRepository } from 'src/global/repository/ProductConfigRepository';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { ProductRepository } from 'src/global/repository/ProductRepository';
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
    FrontUserModule,
  ],
  providers: [OrderService],
  controllers: [FrontOrderController],
})
export class FrontOrderModule {}
