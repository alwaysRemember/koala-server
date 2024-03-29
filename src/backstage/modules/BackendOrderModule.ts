/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-27 14:33:36
 * @LastEditTime: 2020-10-21 16:31:15
 * @FilePath: /koala-server/src/backstage/modules/BackendOrderModule.ts
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/global/dataobject/Order.entity';
import { OrderLogisticsInfo } from 'src/global/dataobject/OrderLogisticsInfo.entity';
import { PayOrder } from 'src/global/dataobject/PayOrder.entity';
import { Product } from 'src/global/dataobject/Product.entity';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { ProductMainImg } from 'src/global/dataobject/ProductMainImg.entity';
import { OrderLogisticsInfoRepository } from 'src/global/repository/OrderLogisticsInfoRepository';
import { OrderRepository } from 'src/global/repository/OrderRepository';
import { PayOrderRepository } from 'src/global/repository/PayOrderRepository';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { ProductMainImgRepository } from 'src/global/repository/ProductMainImgRepository';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { BackendOrderController } from '../controller/BackendOrderController';
import { BackendOrderService } from '../service/BackendOrderService';
import { RedisCacheService } from '../service/RedisCacheService';
import { BackendUserModule } from './BackendUserModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderRepository]),
    TypeOrmModule.forFeature([ProductDetail, ProductDetailRepository]),
    TypeOrmModule.forFeature([ProductMainImg, ProductMainImgRepository]),
    TypeOrmModule.forFeature([
      OrderLogisticsInfo,
      OrderLogisticsInfoRepository,
    ]),
    TypeOrmModule.forFeature([PayOrder, PayOrderRepository]),
    BackendUserModule,
  ],
  providers: [BackendOrderService, RedisCacheService],
  controllers: [BackendOrderController],
})
export class BackendOrderModule {}
