/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-24 17:58:39
 * @LastEditTime: 2020-11-17 16:06:26
 * @FilePath: /koala-server/src/global/service/OrderTasksService.ts
 */

import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { OrderService } from 'src/frontend/service/OrderService';
import { PayOrderRepository } from '../repository/PayOrderRepository';

@Injectable()
export class OrderTasksService {
  constructor(private readonly orderService: OrderService) {}

  // 每半小时跑一次脚本
  @Interval(1800000)
  handle() {
    this.orderService.updateOrderTypeByOrderExpiration();
    this.orderService.autoFinishedOrder();
  }
}
