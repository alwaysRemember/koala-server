import { IProductItem } from './IFrontOrder';

/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:38:40
 * @LastEditTime: 2020-11-11 14:39:04
 * @FilePath: /koala-server/src/frontend/interface/IFrontFavorites.ts
 */
export interface IGetFavoritesResponseData {
  total: number;
  list: Array<IProductItem>;
}
