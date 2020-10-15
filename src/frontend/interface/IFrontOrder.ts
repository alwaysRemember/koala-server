/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:19:40
 * @LastEditTime: 2020-10-15 15:41:18
 * @FilePath: /koala-server/src/frontend/interface/IFrontOrder.ts
 */

import { EOrderType } from 'src/global/enums/EOrder';

export interface ICreateOrderResponse {
  timeStamp: string;
  nonceStr: string;
  package: string;
  paySign: string;
  orderId: string;
}

export interface IOrderRemarkParams {
  productId: string;
  remark: string;
}

export interface IGetOrderResponse {
  orderList: Array<string>;
}

export interface IShoppingAddress {
  name: string;
  phone: string;
  area: Array<string>;
  address: string;
}

export interface IGetOrderListResponse {
  total: number;
  list: Array<IOrderDataItem>;
}

export interface IOrderDataItem {
  orderId: string;
  orderType: EOrderType;
  amount: number;
productList: Array<IProductItem>;
}

export interface IProductItem {
  productId: string;
  img: string;
  name: string;
  amount: string;
  buyQuantity: number;
  productConfigList: Array<string>;
}
