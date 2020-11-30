/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-27 15:16:36
 * @LastEditTime: 2020-11-30 14:37:48
 * @FilePath: /koala-server/src/frontend/form/IShoppingCart.ts
 */


export interface ISaveProductToShoppingCartRequestParams {
  productId: string;
  buyQuantity: number;
  buyConfigList: Array<number>;
}

export interface IDeleteProductForShoppingCartRequestParams {
  idList: Array<string>;
}

export interface IGetShoppingCartProductListRequestParams {
  page: number;
}
