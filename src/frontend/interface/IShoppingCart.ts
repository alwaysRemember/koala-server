/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-30 14:32:44
 * @LastEditTime: 2020-12-02 14:54:32
 * @FilePath: /koala-server/src/frontend/interface/IShoppingCart.ts
 */

import { ProductDetail } from "src/global/dataobject/ProductDetail.entity";
import { ProductMainImg } from "src/global/dataobject/ProductMainImg.entity";
import { ShoppingCart } from "src/global/dataobject/ShoppingCart.entity";
import { EProductStatus } from "src/global/enums/EProduct";


export interface IShoppingCartResponseData {
    total: number;
    list: Array<IShoppingCartItem>;
  }
  export interface IShoppingCartItem {
    shoppingCartId:string;
    productId: string;
    name: string;
    productImg: string;
    amount: number;
    productShipping: number;
    buyQuantity: number;
    buyConfigList: Array<TBuyConfig>;
    productStatus: EProductStatus;
  }

  export interface IShoppingCartSqlResponseItem extends ShoppingCart{
    productDetail: ProductDetail;
    productMainImg: ProductMainImg;
  }
  
  export type TBuyConfig = { id: number; name: string };
  