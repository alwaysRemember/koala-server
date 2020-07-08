/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-07 16:25:18
 * @LastEditTime: 2020-07-08 17:24:05
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
