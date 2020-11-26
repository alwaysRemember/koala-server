import { EProductSortType } from 'src/global/enums/EProduct';

/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-06 15:37:27
 * @LastEditTime: 2020-11-26 15:15:02
 * @FilePath: /koala-server/src/frontend/form/IProduct.ts
 */
export interface IGetProductCommentRequestParams {
  productId: string;
}

export interface IGetProductListRequestParams {
  categoriesId?: string;
  searchName: string;
  productSortType: EProductSortType;
  page: number;
}
