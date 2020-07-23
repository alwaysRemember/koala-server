/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-07 16:25:18
 * @LastEditTime: 2020-07-23 14:36:05
 * @FilePath: /koala-server/src/backstage/schema/BackendCategoriesSchema.ts
 */

import * as Joi from '@hapi/joi';
import { ECategoriesIsUseEnum } from 'src/global/enums/ECategories';

export const BackendAddCategoriesSchema = Joi.object({
  name: Joi.string().required(),
  isUse: Joi.string()
    .allow(ECategoriesIsUseEnum.OFF, ECategoriesIsUseEnum.OFF)
    .required(),
});

export const BackendCategoriesListSchema = Joi.object({
  page: Joi.number().required(),
  pageSize: Joi.number().required(),
});

export const BackendUpdateCategoriesSchema = Joi.object({
  id: Joi.string().required(),
  categoriesName: Joi.string().required(),
  isUse: Joi.boolean().required(),
  isShowOnHome: Joi.boolean().required(),
});
