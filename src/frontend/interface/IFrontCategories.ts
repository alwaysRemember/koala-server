/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-16 18:18:35
 * @LastEditTime: 2020-11-16 18:43:52
 * @FilePath: /koala-server/src/frontend/interface/IFrontCategories.ts
 */

export type TCategoriesResponseData = Array<ICategoriesItem>;

export interface ICategoriesItem {
  id: string;
  imgPath: string;
  name: string;
}
