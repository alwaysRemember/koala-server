/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-27 15:19:38
 * @LastEditTime: 2020-10-13 14:53:02
 * @FilePath: /koala-server/src/backstage/interface/IOrder.ts
 */

import { IShoppingAddress } from 'src/frontend/interface/IFrontOrder';
import { EOrderType } from 'src/global/enums/EOrder';

export interface IGetOrderListResponse {
  total: number;
  list: Array<IOrderItem>;
}

export interface IOrderItem {
  orderId: string;
  payAmount: number;
  orderType: EOrderType;
  createTime: string;
  updateTime: string;
  orderShopping: number;
  shoppingAddress: string;
}

export interface IOrderDetailResponse {
  deliveryInfo: IOrderDetailDeliveryInfo; // 收货信息
  productList: Array<IOrderDetailProductItem>; // 产品列表
  logisticsInfo: null | IOrderLogisticsInfo;
  orderAmount: number; // 订单金额
  orderShopping: number; // 订单运费
  orderType: EOrderType;
  orderId: string;
}
export interface IOrderDetailDeliveryInfo {
  name: string;
  phone: string;
  area: string;
  address: string;
}

export interface IOrderDetailProductItem {
  productId: string;
  name: string;
  img: string;
  buyQuantity: number;
  amount: number;
  remark: string;
}

export interface IOrderLogisticsInfo {
  courierName: string; // 快递名称
  courierNum: string; // 快递单号
}
