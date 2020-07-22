/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-20 16:23:02
 * @LastEditTime: 2020-07-22 14:55:07
 * @FilePath: /koala-server/src/backstage/schema/BackendProductDetailSchema.ts
 */

import * as Joi from '@hapi/joi';
import { EProductStatus } from 'src/global/enums/EProduct';

export const BackendProductDetailSchema = Joi.object({
  productId: Joi.string(),
  name: Joi.string().required(),
  productStatus: Joi.string()
    .allow(EProductStatus.OFF_SHELF, EProductStatus.PUT_ON_SHELF)
    .required(),
  categoriesId: Joi.number().required(),
  productDetail: Joi.string().required(),
  productBrief: Joi.string().required(),
  amount: Joi.number()
    .min(1)
    .required(),
  mediaIdList: Joi.array()
    .items(Joi.number())
    .required(),
  delMediaIdList: Joi.array()
    .items(Joi.number())
    .required(),
  bannerIdList: Joi.array()
    .min(1)
    .items(Joi.number())
    .required(),
  delBannerIdList: Joi.array()
    .items(Joi.number())
    .required(),
  videoId: Joi.number().required(),
  delVideoIdList: Joi.array()
    .items(Joi.number())
    .required(),
});

export const BackendGetProductDetailSchema = Joi.object({
  productId: Joi.string().required(),
});
