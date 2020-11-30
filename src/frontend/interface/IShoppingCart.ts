/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-30 14:32:44
 * @LastEditTime: 2020-11-30 15:17:25
 * @FilePath: /koala-server/src/frontend/interface/IShoppingCart.ts
 */

import { EProductStatus } from "src/global/enums/EProduct";


export interface IShoppingCartResponseData {
    total: number;
    list: Array<IShoppingCartItem>;
  }
  export interface IShoppingCartItem {
    productId: string;
    name: string;
    buyQuantity: number;
    buyConfigList: Array<TBuyConfig>;
    productStatus: EProductStatus;
  }
  
  export type TBuyConfig = { id: number; name: string };
  