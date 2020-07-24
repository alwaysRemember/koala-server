/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-24 15:14:32
 * @LastEditTime: 2020-07-24 16:09:55
 * @FilePath: /koala-server/src/backstage/schema/BackendProductListSchema.ts
 */

import * as Joi from '@hapi/joi';
import { EProductStatus, EDefaultSelect } from 'src/global/enums/EProduct';

export const ProductListRequestParams = Joi.object({
  categoriesId: Joi.string().allow(''),
  productStatus: Joi.string()
    .allow(
      EProductStatus.OFF_SHELF,
      EProductStatus.PUT_ON_SHELF,
      EProductStatus.UNDER_REVIEW,
      EDefaultSelect.ALL,
    )
    .required(),
  userId: Joi.any().required(),
  minAmount: Joi.number().required(),
  maxAmount: Joi.number().required(),
  page: Joi.number()
    .min(1)
    .required(),
  pageSize: Joi.number()
    .min(10)
    .required(),
});
