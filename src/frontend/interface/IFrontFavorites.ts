import { EProductStatus } from 'src/global/enums/EProduct';
import { IProductItem } from './IFrontOrder';

/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:38:40
 * @LastEditTime: 2020-11-12 15:06:16
 * @FilePath: /koala-server/src/frontend/interface/IFrontFavorites.ts
 */
export interface IGetFavoritesResponseData {
  list: Array<IFavoritesItem>;
}

export interface IFavoritesItem {
  favoritesId: number;
  productId: string;
  img: string;
  name: string;
  amount: number;
  productStatus: EProductStatus;
}
