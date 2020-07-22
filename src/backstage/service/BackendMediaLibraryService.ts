/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-15 17:06:07
 * @LastEditTime: 2020-07-21 16:27:29
 * @FilePath: /koala-server/src/backstage/service/BackendMediaLibraryService.ts
 */

import { ProductMediaLibrary } from '../../global/dataobject/ProductMediaLibrary.entity';

export interface BackendMediaLibraryService {
  saveFile(file: File): Promise<{ path: string; id: number }>;

  getAllFile(): Promise<Array<ProductMediaLibrary>>;

  getFileByProductId(productId: number): Promise<Array<ProductMediaLibrary>>;
}
