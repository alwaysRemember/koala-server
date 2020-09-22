/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-14 15:55:10
 * @LastEditTime: 2020-09-22 15:29:05
 * @FilePath: /koala-server/src/frontend/form/IShoppingAddress.ts
 */

export interface IAddShoppingAddressParams {
  id?: number;
  name: string;
  phone: string;
  address: string;
  area: Array<string>;
  isDefaultSelection: boolean;
}
