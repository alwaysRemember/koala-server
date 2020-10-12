/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-27 14:33:08
 * @LastEditTime: 2020-10-12 16:00:17
 * @FilePath: /koala-server/src/backstage/service/BackendOrderService.ts
 */

import { Injectable } from '@nestjs/common';
import { IShoppingAddress } from 'src/frontend/interface/IFrontOrder';
import { EDefaultSelect } from 'src/global/enums/EProduct';
import { OrderRepository } from 'src/global/repository/OrderRepository';
import { reportErr } from 'src/utils/ReportError';
import { BackendUser } from '../dataobject/BackendUser.entity';
import { EBackendUserType } from '../enums/EBackendUserType';
import { BackendException } from '../exception/backendException';
import { IGetOrderListRequestParams } from '../form/BackendOrderForm';
import { IGetOrderListResponse, IOrderItem } from '../interface/IOrder';
import { BackendUserRepository } from '../repository/BackendUserRepository';
import { BackendUserService } from './BackendUserService';
import { RedisCacheService } from './RedisCacheService';

@Injectable()
export class BackendOrderService {
  constructor(
    private readonly backendUserRepository: BackendUserRepository,
    private readonly redisService: RedisCacheService,
    private readonly orderRepository: OrderRepository,
  ) {}

  /**
   * 获取订单列表
   * @param param0
   * @param token
   */
  async getOrderList(
    {
      orderId,
      minOrderAmount,
      maxOrderAmount,
      minOrderCreateDate,
      maxOrderCreateDate,
      orderType,
      userId,
      page,
      pageSize,
    }: IGetOrderListRequestParams,
    token: string,
  ): Promise<IGetOrderListResponse> {
    try {
      let backendUser: BackendUser;
      // 从redis获取当前用户
      const userStr = await this.redisService.get(token);
      if (!userStr) await reportErr('获取当前用户失败');
      const { userId: localUserId }: BackendUser = JSON.parse(userStr);

      // 从数据库获取用户信息
      try {
        backendUser = await this.backendUserRepository.findOne(localUserId);
      } catch (e) {
        await reportErr('获取当前用户失败', e);
      }
      const db = this.orderRepository
        .createQueryBuilder('order')
        .select([
          'order.id as orderId',
          'order.amount as payAmount',
          'order.orderType as orderType',
          'order.createTime as createTime',
          'order.updateTime as updateTime',
          'order.orderShopping as orderShopping',
          'order.shoppingAddress as shoppingAddress',
        ]);
      /* 订单号筛选 */
      orderId && db.andWhere('order.id =:orderId', { orderId });
      /* 最大最小金额筛选 */
      const { sql: amountSql, params: amountParams } = this.createCampareSql<
        number
      >(maxOrderAmount, minOrderAmount, 'amount');
      amountSql && db.andWhere(amountSql, amountParams);
      /* 创建时间筛选 */
      const { sql: dateSql, params: dateParams } = this.createCampareSql<
        Date | string
      >(
        maxOrderCreateDate && new Date(Number(maxOrderCreateDate)),
        minOrderCreateDate && new Date(Number(minOrderCreateDate)),
        'createTime',
      );
      dateSql && db.andWhere(dateSql, dateParams);
      // 订单条件判断
      orderType !== EDefaultSelect.ALL &&
        db.andWhere('order.orderType=:orderType', { orderType });
      // 非管理员只能查看自己的数据 || 某个用户的数据
      if (
        backendUser.userType !== EBackendUserType.ADMIN ||
        userId !== EDefaultSelect.ALL
      ) {
        db.andWhere('order.backendUserUserId =:userId', {
          userId:
            (userId !== EDefaultSelect.ALL && userId) || backendUser.userId,
        });
      }

      const list = await db
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .addOrderBy('order.createTime', 'ASC')
        .getRawMany<IOrderItem>();
      const total = await db.getCount();
      return {
        total,
        list: list.map<IOrderItem>(item => {
          const { area, name, address, phone } = JSON.parse(
            item.shoppingAddress,
          );

          item.shoppingAddress = `${area.join(
            ' ',
          )},${address},${name},${phone}`;
          return item;
        }),
      };
    } catch (e) {
      throw new BackendException(e.message, e);
    }
  }

  /**
   * 创建比较语法的sql
   * @param max 最大值
   * @param min 最小值
   * @param key 键
   */
  private createCampareSql<T>(
    max: T,
    min: T,
    key,
  ): { sql: string; params: { min?: T; max?: T } } {
    const params: { min?: T; max?: T } = {};
    let str = '';
    if (min || max) {
      if (min) {
        params.min = min;
        str = `order.${key}>=:min`;
      }
      if (max) {
        params.max = max;
        str = `order.${key}<=:max`;
      }
      if (max && min) {
        str = `order.${key}>=:min AND order.${key}<=:max`;
      }
    }
    return { sql: str, params };
  }
}
