/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-07 16:40:52
 * @LastEditTime: 2020-07-07 18:13:16
 * @FilePath: /koala-server/src/backstage/form/BackendCategoriesForm.ts
 */
import { ECategoriesIsUseEnum } from 'src/global/enums/ECategories';

export interface IAddCategories {
  name: string;
  isUse: ECategoriesIsUseEnum;
}
