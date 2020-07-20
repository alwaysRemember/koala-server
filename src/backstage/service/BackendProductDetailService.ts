/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:20:59
 * @LastEditTime: 2020-07-20 14:03:01
 * @FilePath: /koala-server/src/backstage/service/BackendProductDetailService.ts
 */
import {
  IUploadProductBanner,
  IUploadProductVideo,
} from '../interface/productDetail';

export interface BackendProductDetailService {
  uploadProductBanner(file: File): Promise<IUploadProductBanner>;
  uploadProductVideo(file: File): Promise<IUploadProductVideo>;
}
