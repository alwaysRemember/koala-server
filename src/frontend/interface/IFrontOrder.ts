/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:19:40
 * @LastEditTime: 2020-11-02 15:21:51
 * @FilePath: /koala-server/src/frontend/interface/IFrontOrder.ts
 */

import { EOrderType } from 'src/global/enums/EOrder';
import { IExpressDataItem } from 'src/global/interface/IExpress';

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
  orderCheck: boolean;
  amount: number;
  productList: Array<IProductItem>;
  orderCheckTime: Date;
  hasRefundCourierInfo: boolean;
}

export interface IProductItem {
  productId: string;
  img: string;
  name: string;
  amount: number;
  buyQuantity: number;
  productConfigList: Array<string>;
}

export interface IGetLogisticsInfoResponseData {
  name: string;
  num: string;
  signStatus: string; // 签收状态
  expressData: Array<IExpressDataItem>;
}

export interface IGetOrderDetailResponseData extends IOrderDataItem {
  orderShopping: number;
  shoppingAddress: IShoppingAddress;
  remarkList: Array<IOrderRemarkParams>;
  orderCheckTime: Date; // 订单签收时间
  refundRecvAccount: string; // 退款入账账户
  refundSuccessTime: string; // 退款成功时间
  transactionId:string; // 支付单号
}
