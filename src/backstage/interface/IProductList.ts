/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-24 15:16:00
 * @LastEditTime: 2020-07-28 15:10:35
 * @FilePath: /koala-server/src/backstage/interface/IProductList.ts
 */

import { EProductStatus, EDefaultSelect } from 'src/global/enums/EProduct';

export interface IProductListRequest {
  categoriesId: string;
  productStatus: EProductStatus | EDefaultSelect;
  userId: EDefaultSelect | number;
  minAmount: number;
  maxAmount: number;
  pageSize: number;
  page: number;
}

export interface IProductItemResponse {
  productId: string;
  productName: string;
  username: string;
  categoriesName: string;
  productAmount: number;
  productBrief: string;
  createTime: Date;
  updateTime: Date;
}
