/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:29:02
 * @LastEditTime: 2020-08-17 16:22:43
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
  productBrief: string;
  productDetail: string;
  bannerList: Array<IUploadProductBanner>;
  videoData: IUploadProductVideo;
  mainImg: IUploadProductMainImg;
  productParameter: Array<{ key: string; value: string }>;
}

export interface IUpdateProductStatus {
  productId: string;
  productStatus: EProductStatus;
}
