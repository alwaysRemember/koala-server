/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-07 16:40:52
 * @LastEditTime: 2020-07-23 14:35:46
 * @FilePath: /koala-server/src/backstage/form/BackendCategoriesForm.ts
 */
import { ECategoriesIsUseEnum } from 'src/global/enums/ECategories';

export interface IAddCategories {
  name: string;
  isUse: ECategoriesIsUseEnum;
}

export interface ICategoriesList {
  page: number;
  pageSize: number;
}

export interface IUpdateCategories {
  id: string;
  categoriesName: string;
  isUse: boolean;
  isShowOnHome: boolean;
}
