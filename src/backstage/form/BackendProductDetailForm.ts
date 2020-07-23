/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-20 16:22:10
 * @LastEditTime: 2020-07-23 14:41:44
 * @FilePath: /koala-server/src/backstage/form/BackendProductDetailForm.ts
 */

import { EProductStatus } from 'src/global/enums/EProduct';

export interface IProductDetail {
  productId?: string;
  name: string;
  productStatus: EProductStatus;
  amount: number;
  productBrief: string;
  categoriesId: string;
  productDetail: string;
  mediaIdList: Array<string>;
  delMediaIdList: Array<string>;
  bannerIdList: Array<string>;
  delBannerIdList: Array<string>;
  videoId: string | undefined;
  delVideoIdList: Array<string>;
}
