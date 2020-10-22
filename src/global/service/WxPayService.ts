/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-23 16:52:54
 * @LastEditTime: 2020-10-22 15:03:53
 * @FilePath: /koala-server/src/global/service/wxPayService.ts
 */

import { Injectable } from '@nestjs/common';
import { FrontException } from 'src/frontend/exception/FrontException';
import { FrontUserService } from 'src/frontend/service/UserService';
import { Mail } from 'src/utils/Mail';
import { reportErr } from 'src/utils/ReportError';
import { EntityManager, getManager } from 'typeorm';
import { Order } from '../dataobject/Order.entity';
import { PayOrder } from '../dataobject/PayOrder.entity';
import { EOrderRefundStatus, EOrderType } from '../enums/EOrder';
import {
  IWxPayNotifyData,
  IWxPayReturnOfGoodsNotifyData,
} from '../interface/IWxPay';
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
          try {
            const orderList = await this.orderRepository.findByIds(
              payOrder.orderList.map(({ id }) => id),
              {
                join: {
                  alias: 'order',
                  leftJoinAndSelect: {
                    backendUser: 'order.backendUser',
                    productList: 'order.productList',
                  },
                },
              },
            );
            orderList.map(item => {
              try {
                new Mail(
                  '有用户下单，请尽快处理！',
                  {
                    订单ID: item.id,
                    商品: `${item.productList.map(
                      p =>
                        `${p.productName} x${
                          item.buyProductQuantityList.find(
                            b => b.productId === p.id,
                          )?.buyQuantity
                        }\n`,
                    )}`,
                    收货信息: `${Object.keys(item.shoppingAddress)
                      .map(key => item.shoppingAddress[key])
                      .join('\n')}`,
                  },
                  item.backendUser.email,
                ).send();
              } catch (e) {}
            });
          } catch (e) {}
        },
      );
    } catch (e) {
      // this.checkOrder(data);
      throw new FrontException(`微信支付通知回调：${e.message}`, e);
    }
  }

  /**
   * 校验退款订单
   * @param data
   */
  async checkReturnOfGoodsOrder({
    refund_id,
    refund_status,
    success_time,
    refund_recv_accout,
    refund_account,
  }: IWxPayReturnOfGoodsNotifyData) {
    try {
      // 根据微信退款单号查找订单
      const order = await this.orderRepository.findOne({
        where: {
          refundId: refund_id,
        },
      });

      if (!order)
        await reportErr(`未根据当前微信退款单号查到订单：${refund_id}`);

      // 如果存在退款成功时间则证明已经退款过了
      if (order.refundSuccessTime)
        await reportErr(`当前订单已经退款成功：${order.id}`);
      getManager().transaction(
        'REPEATABLE READ',
        async (entityManager: EntityManager) => {
          // 退款成功则改变订单状态
          if (refund_status === EOrderRefundStatus.SUCCESS) {
            order.orderType = EOrderType.SUCCESS_RETURN;
          }
          order.refundStatus = refund_status;
          order.refundAccount = refund_account;
          order.refundRecvAccount = refund_recv_accout;
          order.refundSuccessTime = success_time;
          await this.orderRepository.update(order.id, order);
        },
      );
    } catch (e) {
      throw new FrontException(`微信退款通知回调: ${e.message}`, e);
    }
  }
}
