import { EOrderType } from 'src/global/enums/EOrder';
/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-27 14:50:06
 * @LastEditTime: 2020-10-26 16:16:12
 * @FilePath: /koala-server/src/backstage/form/BackendOrderForm.ts
 */

import { EDefaultSelect } from 'src/global/enums/EProduct';

export interface IGetOrderListRequestParams {
  orderId: string;
  minOrderAmount: number;
  maxOrderAmount: number;
  minOrderCreateDate: string;
  maxOrderCreateDate: string;
  orderType: EDefaultSelect | EOrderType;
  userId: number | EDefaultSelect;
  page: number;
  pageSize: number;
}

export interface IOrderDetailRequestParams {
  orderId: string;
}

export interface IUpdateOrderLogisticsInfoDefaultParams {
  code: string;
  num: string;
  name: string;
}

export interface IUpdateOrderLogisticsInfoRequestParams
  extends IUpdateOrderLogisticsInfoDefaultParams {
  isNeedExpress: boolean;
  orderId: string;
}

export interface IReturnOfGoodsRequestParams {
  orderId: string;
}
