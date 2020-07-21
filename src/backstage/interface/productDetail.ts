/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:29:02
 * @LastEditTime: 2020-07-21 16:00:01
 * @FilePath: /koala-server/src/backstage/interface/productDetail.ts
 */

import { EProductStatus } from 'src/global/enums/EProduct';

export interface IUploadProductBanner {
  id: number;
  name: string;
  size: number;
  url: string;
}

export interface IUploadProductVideo {
  id: number;
  name: string;
  size?: number;
  url: string;
}

export interface IProductResponse {
  name: string;
  productStatus: EProductStatus;
  categoriesId: number;
  amount: number;
  productBrief: string;
  productDetail: string;
  bannerList: Array<IUploadProductBanner>;
  videoData: IUploadProductVideo;
}
