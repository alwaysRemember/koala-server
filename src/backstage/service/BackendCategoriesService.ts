/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 18:12:32
 * @LastEditTime: 2020-07-08 17:43:42
 * @FilePath: /koala-server/src/backstage/service/BackendCategoriesService.ts
 */

import { IAddCategories, ICategoriesList } from '../form/BackendCategoriesForm';
import { InsertResult } from 'typeorm';
import { Categories } from 'src/global/dataobject/Categories.entity';

export interface BackendCategoriesService {
  save(file: File, data: IAddCategories): Promise<InsertResult>;
  getCagegoriesList(data: ICategoriesList): Promise<Array<Categories>>;

  getAllCagetories(): Promise<Array<Categories>>;
}
