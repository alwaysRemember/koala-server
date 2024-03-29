/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:29:20
 * @LastEditTime: 2020-11-02 15:13:45
 * @FilePath: /koala-server/src/frontend/form/IFrontOrder.ts
 */

import { EOrderType } from 'src/global/enums/EOrder';

/**
 * 下单接口所需参数
 */
export interface ICreateOrderParams {
  buyProductList: Array<IOrderItem>;
  addressId: number;
}

/**
 * 下单产品参数
 */
export interface IOrderItem {
  productId: string;
  buyQuantity: number; // 购买数量
  selectProductConfigList: Array<number>;
  remarks: string;
}

export interface IGetOrderListRequestParams {
  page: number;
  orderType: EOrderType | 'ALL';
}

export interface ICancelOrder {
  orderId: string;
}

export interface IReturnOfGoodsParams {
  orderId: string;
  reason: string;
}

export interface IConfirmOrder {
  orderId: string;
}

export interface IRefundCourierInfo {
  courierName: string;
  courierNum: string;
  orderId: string;
}

export interface IGetLogisticsInfoRequestParams {
  orderId: string;
}

export interface ISubmitOrderCommentRequestParams {
  orderId: string;
  productList: Array<ICommentProductItem>;
}
export interface ICommentProductItem {
  productId: string;
  rate: number;
  text: string;
}
export interface ISearchOrderRequestParams {
  page: number;
  searchValue: string;
}

export interface IGetOrderDetailRequestParams{
  orderId:string;
}