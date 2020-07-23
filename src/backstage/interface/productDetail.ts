/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:29:02
 * @LastEditTime: 2020-07-23 14:40:06
 * @FilePath: /koala-server/src/backstage/interface/productDetail.ts
 */

import { EProductStatus } from 'src/global/enums/EProduct';

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

export interface IProductResponse {
  name: string;
  productStatus: EProductStatus;
  categoriesId: string;
  amount: number;
  productBrief: string;
  productDetail: string;
  bannerList: Array<IUploadProductBanner>;
  videoData: IUploadProductVideo;
}
