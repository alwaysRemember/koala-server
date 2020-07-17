/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:20:59
 * @LastEditTime: 2020-07-17 15:30:09
 * @FilePath: /koala-server/src/backstage/service/BackendProductService.ts
 */
import { IUploadProductBanner } from '../interface/product';

export interface BackendProductService {
  uploadProductBanner(file: File): Promise<IUploadProductBanner>;
}
