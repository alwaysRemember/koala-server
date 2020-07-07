/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 18:12:32
 * @LastEditTime: 2020-07-07 18:15:57
 * @FilePath: /koala-server/src/backstage/service/BackendCategoriesService.ts
 */

import { IAddCategories } from '../form/BackendCategoriesForm';

export interface BackendCategoriesService {
  save(file: File, data: IAddCategories): void;
}
