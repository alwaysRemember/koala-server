/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-27 14:33:08
 * @LastEditTime: 2020-10-14 19:19:09
 * @FilePath: /koala-server/src/backstage/service/BackendOrderService.ts
 */

import { Injectable } from '@nestjs/common';
import { IShoppingAddress } from 'src/frontend/interface/IFrontOrder';
import { Order } from 'src/global/dataobject/Order.entity';
import { OrderLogisticsInfo } from 'src/global/dataobject/OrderLogisticsInfo.entity';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { ProductMainImg } from 'src/global/dataobject/ProductMainImg.entity';
import { EOrderType } from 'src/global/enums/EOrder';
import { EDefaultSelect } from 'src/global/enums/EProduct';
import { OrderLogisticsInfoRepository } from 'src/global/repository/OrderLogisticsInfoRepository';
import { OrderRepository } from 'src/global/repository/OrderRepository';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { ProductMainImgRepository } from 'src/global/repository/ProductMainImgRepository';
import { reportErr } from 'src/utils/ReportError';
import { EntityManager, getManager } from 'typeorm';
import { BackendUser } from '../dataobject/BackendUser.entity';
import { EBackendUserType } from '../enums/EBackendUserType';
import { BackendException } from '../exception/backendException';
import {
  IGetOrderListRequestParams,
  IUpdateOrderLogisticsInfoRequestParams,
} from '../form/BackendOrderForm';
import {
  IGetOrderListResponse,
  IOrderDetailResponse,
  IOrderItem,
  IOrderLogisticsInfo,
  IUpdateOrderLogisticsInfoResponse,
} from '../interface/IOrder';
import { BackendUserRepository } from '../repository/BackendUserRepository';
import { BackendUserService } from './BackendUserService';
import { RedisCacheService } from './RedisCacheService';

@Injectable()
export class BackendOrderService {
  constructor(
    private readonly backendUserRepository: BackendUserRepository,
    private readonly redisService: RedisCacheService,
    private readonly orderRepository: OrderRepository,
    private readonly productDetailRepository: ProductDetailRepository,
    private readonly productMainImgRepository: ProductMainImgRepository,
    private readonly orderLogisticsInfoRepository: OrderLogisticsInfoRepository,
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
        .addOrderBy('order.createTime', 'DESC')
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
   * 获取订单详情
   * @param orderId
   * @param token
   */
  async getOrderDetail(
    orderId: string,
    token: string,
  ): Promise<IOrderDetailResponse> {
    try {
      let localUserStr: string;
      let order: Order;
      let mainImgList: Array<ProductMainImg>; // 商品主图list
      let productDetailList: Array<ProductDetail>; // 商品详情list

      // 获取当前用户
      try {
        localUserStr = await this.redisService.get(token);
      } catch (e) {
        await reportErr('获取当前登录用户失败', e);
      }
      if (!localUserStr) await reportErr('获取不到当前登录用户');
      const { userId: localUserId, userType } = JSON.parse(localUserStr);

      // 获取当前订单
      try {
        order = await this.orderRepository.findOne(orderId, {
          join: {
            alias: 'order',
            leftJoinAndSelect: {
              backendUser: 'order.backendUser',
              productList: 'order.productList',
              logisticsInfo: 'order.logisticsInfo',
            },
          },
        });
      } catch (e) {
        await reportErr('获取订单失败', e);
      }
      // 判断权限||当前订单是否属于当前登录用户
      if (
        localUserId !== order.backendUser.userId &&
        userType !== EBackendUserType.ADMIN
      ) {
        await reportErr('当前登录账号无权查看此订单');
      }
      // 获取商品信息
      try {
        mainImgList = await this.productMainImgRepository.findByIds(
          order.productList.map(item => item.productMainImgId),
          {
            select: ['id', 'path'],
          },
        );
        productDetailList = await this.productDetailRepository.findByIds(
          order.productList.map(item => item.productDetailId),
          {
            select: ['id', 'productAmount', 'productShipping'],
          },
        );
      } catch (e) {
        await reportErr('获取订单详情失败', e);
      }

      // 组合数据
      return {
        deliveryInfo: {
          name: order.shoppingAddress.name,
          phone: order.shoppingAddress.phone,
          area: order.shoppingAddress.area.join(' '),
          address: order.shoppingAddress.address,
        },
        productList: order.productList.map(
          ({ id, productName, productMainImgId, productDetailId }) => ({
            productId: id,
            name: productName,
            img: mainImgList.find(data => data.id === productMainImgId).path,
            buyQuantity: order.buyProductQuantityList.find(
              data => data.productId === id,
            ).buyQuantity,
            amount: productDetailList.find(data => data.id === productDetailId)
              .productAmount,
            remark: order.remarkList.find(data => data.productId === id).remark,
          }),
        ),
        logisticsInfo: order.logisticsInfo
          ? {
              courierName: order.logisticsInfo.name,
              courierNum: order.logisticsInfo.num,
              courierCode: order.logisticsInfo.code,
            }
          : null,
        orderAmount: order.amount,
        orderShopping: order.orderShopping,
        orderType: order.orderType,
        orderId: order.id,
      };
    } catch (e) {
      throw new BackendException(e.message, e);
    }
  }

  /**
   * 更新订单物流信息
   * @param params
   * @param token
   */
  async updateOrderLogisticsInfo(
    { orderId, code, name, num }: IUpdateOrderLogisticsInfoRequestParams,
    token: string,
  ): Promise<IUpdateOrderLogisticsInfoResponse> {
    try {
      let order: Order;
      const { userId: localUserId, userType }: BackendUser = JSON.parse(
        await this.redisService.get(token),
      );
      try {
        order = await this.orderRepository.findOne(orderId, {
          join: {
            alias: 'order',
            leftJoinAndSelect: {
              backendUser: 'order.backendUser',
              logisticsInfo: 'order.logisticsInfo',
            },
          },
        });
      } catch (e) {
        await reportErr('订单信息获取出错', e);
      }
      if (!order) {
        await reportErr('查询不到当前订单');
      }
      // 非管理员并且当前登录账号跟查询的订单归属人对不上
      if (
        userType !== EBackendUserType.ADMIN &&
        order.backendUser.userId !== localUserId
      ) {
        await reportErr('无权修改此订单');
      }

      await getManager()
        .transaction(async (entityManager: EntityManager) => {
          const logisticsInfo = new OrderLogisticsInfo();
          logisticsInfo.code = code;
          logisticsInfo.name = name;
          logisticsInfo.num = num;
          // 存在物流信息则为修改，不存在则为新增
          if (order.logisticsInfo) {
            logisticsInfo.id = order.logisticsInfo.id;
            await entityManager.update(
              OrderLogisticsInfo,
              logisticsInfo.id,
              logisticsInfo,
            );
          } else {
            const data = await entityManager.save(
              OrderLogisticsInfo,
              logisticsInfo,
            );
            order.logisticsInfo = data;
          }
          // 修改订单状态为待收货
          order.orderType = EOrderType.TO_BE_RECEIVED;
          await entityManager.update(Order, order.id, order);
        })
        .catch(async e => {
          await reportErr('更新订单物流信息失败', e);
        });
      return {
        orderType: EOrderType.TO_BE_RECEIVED,
        name,
        num,
        code,
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
