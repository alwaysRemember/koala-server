/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-20 16:22:10
 * @LastEditTime: 2020-07-22 11:45:24
 * @FilePath: /koala-server/src/backstage/form/BackendProductDetailForm.ts
 */

import { EProductStatus } from 'src/global/enums/EProduct';

export interface IProductDetail {
  productId?: number;
  name: string;
  productStatus: EProductStatus;
  amount: number;
  productBrief: string;
  categoriesId: number;
  productDetail: string;
  mediaIdList: Array<number>;
  delMediaIdList: Array<number>;
  bannerIdList: Array<number>;
  delBannerIdList: Array<number>;
  videoId: number | undefined;
  delVideoIdList: Array<number>;
}
