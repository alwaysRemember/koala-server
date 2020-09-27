/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-27 14:33:36
 * @LastEditTime: 2020-09-27 16:39:24
 * @FilePath: /koala-server/src/backstage/modules/BackendOrderModule.ts
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/global/dataobject/Order.entity';
import { OrderRepository } from 'src/global/repository/OrderRepository';
import { BackendOrderController } from '../controller/BackendOrderController';
import { BackendOrderService } from '../service/BackendOrderService';
import { RedisCacheService } from '../service/RedisCacheService';
import { BackendUserModule } from './BackendUserModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderRepository]),
    BackendUserModule
  ],
  providers: [BackendOrderService, RedisCacheService],
  controllers: [BackendOrderController],
})
export class BackendOrderModule {}
