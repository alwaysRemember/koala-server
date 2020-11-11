import { EProductStatus } from 'src/global/enums/EProduct';
import { IProductItem } from './IFrontOrder';

/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:38:40
 * @LastEditTime: 2020-11-11 17:38:37
 * @FilePath: /koala-server/src/frontend/interface/IFrontFavorites.ts
 */
export interface IGetFavoritesResponseData {
  total: number;
  list: Array<IFavoritesItem>;
}

export interface IFavoritesItem {
  productId: string;
  img: string;
  name: string;
  amount: number;
  productStatus: EProductStatus;
}