/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-14 15:55:10
 * @LastEditTime: 2020-09-14 15:55:27
 * @FilePath: /koala-server/src/frontend/form/ShoppingAddress.ts
 */

export interface IAddShoppingAddressParams {
  id?: number;
  name: string;
  phone: string;
  address: string;
  area: Array<string>;
  isDefaultSelection: boolean;
}
