/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 18:12:32
 * @LastEditTime: 2020-07-14 16:43:40
 * @FilePath: /koala-server/src/backstage/service/BackendCategoriesService.ts
 */

import {
  IAddCategories,
  ICategoriesList,
  IUpdateCategories,
} from '../form/BackendCategoriesForm';
import { InsertResult } from 'typeorm';
import { Categories } from 'src/global/dataobject/Categories.entity';

export interface BackendCategoriesService {
  save(file: File, data: IAddCategories): Promise<InsertResult>;
  getCagegoriesList(
    data: ICategoriesList,
    isUse: boolean,
  ): Promise<Array<Categories>>;

  getAllCagetories(): Promise<Array<Categories>>;

  updateCategories(params: IUpdateCategories): void;
}
