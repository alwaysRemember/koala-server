/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-14 15:55:56
 * @LastEditTime: 2020-09-17 15:15:40
 * @FilePath: /koala-server/src/frontend/interface/ShoppingAddress.ts
 */

import { ShoppingAddress } from '../dataobject/ShoppingAddress.entity';

/**
 * 获取默认收货地址接口response
 */
export interface IGetDefaultShoppingAddressResponse {
  defaultAddress: ShoppingAddress;
  addressLength: number;
}
