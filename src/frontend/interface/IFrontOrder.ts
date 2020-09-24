/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:19:40
 * @LastEditTime: 2020-09-24 18:30:48
 * @FilePath: /koala-server/src/frontend/interface/IFrontOrder.ts
 */

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

export interface IShppingAddress {
  name: string;
  phone: string;
  area: Array<string>;
  address: string;
}
