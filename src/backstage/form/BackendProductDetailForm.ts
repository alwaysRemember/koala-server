/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-20 16:22:10
 * @LastEditTime: 2020-08-17 15:08:41
 * @FilePath: /koala-server/src/backstage/form/BackendProductDetailForm.ts
 */

import { EProductStatus } from 'src/global/enums/EProduct';

export interface IProductDetail {
  productId?: string;
  name: string;
  productStatus: EProductStatus;
  productType: boolean;
  amount: number;
  productBrief: string;
  categoriesId: string;
  productDetail: string;
  mediaIdList: Array<string>;
  delMediaIdList: Array<string>;
  bannerIdList: Array<string>;
  delBannerIdList: Array<string>;
  videoId: string;
  delVideoIdList: Array<string>;
  mainImgId: string;
  delMainImgIdList: Array<string>;
  productParameter: Array<{ key: string; value: string }>;
}
