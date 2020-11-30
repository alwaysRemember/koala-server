/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-20 16:22:10
 * @LastEditTime: 2020-11-30 16:26:12
 * @FilePath: /koala-server/src/backstage/form/BackendProductDetailForm.ts
 */

import { EProductStatus } from 'src/global/enums/EProduct';
import { IProductConfig } from '../interface/IProductDetail';

export interface IProductDetail {
  productId?: string;
  name: string;
  productStatus: EProductStatus;
  productType: boolean;
  amount: number;
  costAmount: number;
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
  productConfigList: Array<IProductConfig>;
  productConfigDelList: Array<number>;
  productDeliveryCity: string;
  productShipping: number;
}
