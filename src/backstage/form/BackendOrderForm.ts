import { EOrderType } from 'src/global/enums/EOrder';
/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-27 14:50:06
 * @LastEditTime: 2020-09-27 17:51:31
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
