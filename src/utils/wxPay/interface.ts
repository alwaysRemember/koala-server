/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-18 16:11:44
 * @LastEditTime: 2020-10-20 17:04:36
 * @FilePath: /koala-server/src/frontend/wxPay/interface.ts
 */

import { ETradeType } from './enums';

export interface IWxPayParams {
  appid: string; // 小程序id
  mchId: string; // 商户号
  tradeType?: ETradeType; // 交易类型
}

export interface IWxPayOrderParams {
  body: string; // 商品描述
  amount: number; // 支付金额 分
  orderId: string; // 系统内的订单id
  openId: string; // 小程序用户id
}

export interface IReturnOfGoodsParams {
  transactionId: string; // 微信订单号
  totalFee: number; // 订单总金额
  refundFee: number; // 退款金额
  refundDesc: string; // 退款原因
}

export interface ICreateWxPayOrderResponse {
  timeStamp: string;
  nonceStr: string;
  package: string;
  paySign: string;
}
