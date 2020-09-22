/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:19:40
 * @LastEditTime: 2020-09-22 15:34:13
 * @FilePath: /koala-server/src/frontend/interface/IFrontOrder.ts
 */

export interface ICreateOrderResponse {
  timeStamp: string;
  nonceStr: string;
  package: string;
  paySign: string;
}

export interface IOrderRemarkParams {
  productId: string;
  remark: string;
}
