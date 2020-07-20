/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:29:02
 * @LastEditTime: 2020-07-20 14:02:48
 * @FilePath: /koala-server/src/backstage/interface/productDetail.ts
 */

export interface IUploadProductBanner {
  id: number;
  name: string;
  size: number;
  url: string;
}

export interface IUploadProductVideo {
  id: number;
  name: string;
  size: number;
  url: string;
}
