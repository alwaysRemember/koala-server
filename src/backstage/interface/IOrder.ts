/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-27 15:19:38
 * @LastEditTime: 2020-10-21 17:24:55
 * @FilePath: /koala-server/src/backstage/interface/IOrder.ts
 */

import { IShoppingAddress } from 'src/frontend/interface/IFrontOrder';
import {
  EOrderRefundAccount,
  EOrderRefundStatus,
  EOrderType,
} from 'src/global/enums/EOrder';
import { IUpdateOrderLogisticsInfoDefaultParams } from '../form/BackendOrderForm';

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
  refundId: string;
  outRefundNo: string;
  refundStatus: EOrderRefundStatus;
  refundRecvAccount: string;
  refundSuccessTime: string;
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
  courierCode: string;
  courierNum: string; // 快递单号
}
export interface IUpdateOrderLogisticsInfoResponse
  extends IUpdateOrderLogisticsInfoDefaultParams {
  orderType: EOrderType;
}
