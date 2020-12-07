/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-18 17:05:41
 * @LastEditTime: 2020-12-07 18:54:49
 * @FilePath: /koala-server/src/global/modules/WxPayModule.ts
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrontUserModule } from 'src/frontend/modules/FrontUserModule';
import { WxPayController } from '../controller/WxPayController';
import { Order } from '../dataobject/Order.entity';
import { PayOrder } from '../dataobject/PayOrder.entity';
import { OrderRepository } from '../repository/OrderRepository';
import { PayOrderRepository } from '../repository/PayOrderRepository';
import { WxPayService } from '../service/WxPayService';

@Module({
  imports: [
    FrontUserModule,
    TypeOrmModule.forFeature([Order, OrderRepository]),
    TypeOrmModule.forFeature([PayOrder, PayOrderRepository]),
  ],
  controllers: [WxPayController],
  providers: [WxPayService],
})
export class wxPayModule {}
