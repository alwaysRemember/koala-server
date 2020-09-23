/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-23 16:52:54
 * @LastEditTime: 2020-09-23 19:13:47
 * @FilePath: /koala-server/src/global/service/wxPayService.ts
 */

import { Injectable } from '@nestjs/common';
import { FrontUserService } from 'src/frontend/service/UserService';
import { EntityManager, getManager } from 'typeorm';
import { Order } from '../dataobject/Order.entity';
import { PayOrder } from '../dataobject/PayOrder.entity';
import { EOrderType } from '../enums/EOrder';
import { IWxPayNotifyData } from '../interface/WxPay';
import { OrderRepository } from '../repository/OrderRepository';
import { PayOrderRepository } from '../repository/PayOrderRepository';

@Injectable()
export class WxPayService {
  constructor(
    private readonly frontUserService: FrontUserService,
    private readonly orderRepository: OrderRepository,
    private readonly payOrderRepository: PayOrderRepository,
  ) {}
  async checkOrder(data: IWxPayNotifyData) {
    const {
      orderId,
      bankType,
      cashFee,
      feeType,
      mchId,
      outTradeNo,
      transactionId,
    } = data;
    try {
      // 查找支付订单
      const payOrder = await this.payOrderRepository.findOne(orderId, {
        join: {
          alias: 'payOrder',
          leftJoinAndSelect: {
            orderList: 'payOrder.orderList',
          },
        },
      });
      // 存在支付金额证明已经更新过数据
      if (!payOrder || payOrder.cashFee !== 0) return;
      await getManager().transaction(
        'REPEATABLE READ',
        async (entityManager: EntityManager) => {
          await entityManager.update(PayOrder, payOrder.id, {
            bankType,
            feeType,
            mchId,
            outTradeNo,
            cashFee,
            transactionId,
          });
          await entityManager.update(
            Order,
            payOrder.orderList.map(({ id }) => id),
            {
              orderType: EOrderType.TO_BE_DELIVERED,
            },
          );
        },
      );
    } catch (e) {
      console.log(e);
      console.log('**************');
      // this.checkOrder(data);
    }
  }
}
