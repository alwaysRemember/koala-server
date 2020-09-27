/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-27 15:19:38
 * @LastEditTime: 2020-09-27 18:34:03
 * @FilePath: /koala-server/src/backstage/interface/IOrder.ts
 */

import { IShoppingAddress } from 'src/frontend/interface/IFrontOrder';
import { EOrderType } from 'src/global/enums/EOrder';

export interface IGetOrderListResponse {
  total: number;
  list: Array<IOrderItem>;
}


export interface IOrderItem{
  orderId: string;
  payAmount: number;
  orderType: EOrderType;
  createTime: string;
  updateTime: string;
  orderShopping: number;
  shoppingAddress: string;
}
