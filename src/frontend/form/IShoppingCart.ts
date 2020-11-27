/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-27 15:16:36
 * @LastEditTime: 2020-11-27 15:42:31
 * @FilePath: /koala-server/src/frontend/form/IShoppingCart.ts
 */

export interface ISaveProductToShoppingCartRequestParams {
  productId: string;
  buyQuantity: number;
  buyConfigList: Array<number>;
}
