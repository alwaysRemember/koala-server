/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:20:59
 * @LastEditTime: 2020-07-20 17:40:31
 * @FilePath: /koala-server/src/backstage/service/BackendProductDetailService.ts
 */
import {
  IUploadProductBanner,
  IUploadProductVideo,
} from '../interface/productDetail';
import { IProductDetail } from '../form/BackendProductDetailForm';

export interface BackendProductDetailService {
  uploadProductBanner(file: File): Promise<IUploadProductBanner>;
  uploadProductVideo(file: File): Promise<IUploadProductVideo>;
  uploadProduct(data: IProductDetail, token: string): void;
}
