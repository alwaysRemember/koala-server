/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 18:12:32
 * @LastEditTime: 2020-07-08 16:54:07
 * @FilePath: /koala-server/src/backstage/service/BackendCategoriesService.ts
 */

import { IAddCategories } from '../form/BackendCategoriesForm';
import { InsertResult } from 'typeorm';

export interface BackendCategoriesService {
  save(file: File, data: IAddCategories): Promise<InsertResult>;
}
