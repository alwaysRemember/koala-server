/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-10-26 14:30:26
 * @LastEditTime: 2020-12-07 18:55:10
 * @FilePath: /koala-server/src/global/service/ExpressService.ts
 */
import { Body, Injectable } from '@nestjs/common';
import { BackendException } from 'src/backstage/exception/BackendException';
import { EntityManager, getManager } from 'typeorm';
import { Order } from '../dataobject/Order.entity';
import { OrderLogisticsInfo } from '../dataobject/OrderLogisticsInfo.entity';
import { EOrderType } from '../enums/EOrder';
import { OrderLogisticsInfoRepository } from '../repository/OrderLogisticsInfoRepository';
import { OrderRepository } from '../repository/OrderRepository';

@Injectable()
export class ExpressService {
  private signStatus = {
    '0': '在途',
    '1': '揽收',
    '2': '疑难',
    '3': '签收',
    '4': '退签',
    '5': '派件',
    '6': '退回',
    '7': '转单',
    '10': '待清关',
    '11': '清关中',
    '12': '已清关',
    '13': '清关异常',
    '14': '拒签',
  };

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderLogisticsInfoRepository: OrderLogisticsInfoRepository,
  ) {}

  async expressNotify({ lastResult: { nu, ischeck, data, state }, status }) {
    try {
      // 根据快递单号查找快递记录
      const orderLogisticsInfo = await this.orderLogisticsInfoRepository.findOne(
        {
          where: {
            num: nu,
          },
        },
      );
      // 根据快递记录获取订单信息
      const order = await this.orderRepository.findOne({
        where: {
          logisticsInfo: orderLogisticsInfo,
        },
      });
      // 判断订单是否签收
      if (order.orderCheck) return;

      // 判断是否为已签收
      if (!!Number(ischeck)) {
        // 转为待评价
        order.orderType = EOrderType.COMMENT;
        order.orderCheck = true;
        order.orderCheckTime = new Date(data[0].ftime);
      }

      orderLogisticsInfo.expressStatus = status;
      orderLogisticsInfo.expressData = data.map(({ context, ftime: time }) => ({
        context,
        time,
      }));
      orderLogisticsInfo.signStatus = this.signStatus[state];
      await getManager().transaction(async (entityManager: EntityManager) => {
        await entityManager.update(Order, order.id, order);
        await entityManager.update(
          OrderLogisticsInfo,
          orderLogisticsInfo.id,
          orderLogisticsInfo,
        );
      });
    } catch (e) {
      throw new BackendException(e.message, e);
    }
  }
}
