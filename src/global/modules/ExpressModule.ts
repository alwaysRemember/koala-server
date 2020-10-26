/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-10-26 14:29:26
 * @LastEditTime: 2020-10-26 15:09:19
 * @FilePath: /koala-server/src/global/modules/ExpressModule.ts
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpressController } from '../controller/ExpressController';
import { Order } from '../dataobject/Order.entity';
import { OrderLogisticsInfo } from '../dataobject/OrderLogisticsInfo.entity';
import { OrderLogisticsInfoRepository } from '../repository/OrderLogisticsInfoRepository';
import { OrderRepository } from '../repository/OrderRepository';
import { ExpressService } from '../service/ExpressService';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderRepository]),
    TypeOrmModule.forFeature([
      OrderLogisticsInfo,
      OrderLogisticsInfoRepository,
    ]),
  ],
  controllers: [ExpressController],
  providers: [ExpressService],
})
export class ExperssModule {}
