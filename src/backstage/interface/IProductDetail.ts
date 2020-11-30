/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:29:02
 * @LastEditTime: 2020-11-30 16:16:33
 * @FilePath: /koala-server/src/backstage/interface/IProductDetail.ts
 */

import { EProductStatus, EDefaultSelect } from 'src/global/enums/EProduct';

export interface IUploadProductBanner {
  id: string;
  name: string;
  size: number;
  url: string;
}

export interface IUploadProductVideo {
  id: string;
  name: string;
  size?: number;
  url: string;
}
export interface IUploadProductMainImg {
  id: string;
  name: string;
  size?: number;
  url: string;
}

export interface IProductResponse {
  name: string;
  productStatus: EProductStatus;
  productType: boolean;
  categoriesId: string;
  amount: number;
  costAmount: number; // 成本价
  productBrief: string;
  productDetail: string;
  bannerList: Array<IUploadProductBanner>;
  videoData: IUploadProductVideo;
  mainImg: IUploadProductMainImg;
  productParameter: Array<{ key: string; value: string }>;
  productConfigList: Array<IProductConfig>;
  productDeliveryCity: string;
  productShipping: number;
}

export interface IProductConfig {
  id?: number;
  name: string;
  amount: number;
  costAmount: number;
  categoryName: string;
}

export interface IUpdateProductStatus {
  productId: string;
  productStatus: EProductStatus;
}
