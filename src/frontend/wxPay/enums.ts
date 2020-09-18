/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-18 16:17:04
 * @LastEditTime: 2020-09-18 16:20:25
 * @FilePath: /koala-server/src/frontend/wxPay/enums.ts
 */

// 交易类型
export enum ETradeType {
  JSAPI = 'JSAPI', // jsapi支付| 小程序支付
  NATIVE = 'NATIVE', // native支付
  APP = 'APP', // app支付
  MWEB = 'MWEB', // H5支付
}
