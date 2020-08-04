/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-20 16:23:02
 * @LastEditTime: 2020-08-04 14:24:38
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
  categoriesId: Joi.string().required(),
  productDetail: Joi.string().required(),
  productBrief: Joi.string().required(),
  amount: Joi.number()
    .min(1)
    .required(),
  mediaIdList: Joi.array()
    .items(Joi.string())
    .required(),
  delMediaIdList: Joi.array()
    .items(Joi.string())
    .required(),
  bannerIdList: Joi.array()
    .min(1)
    .items(Joi.string())
    .required(),
  delBannerIdList: Joi.array()
    .items(Joi.string())
    .required(),
  mainImgId: Joi.string().required(),
  delMainImgIdList: Joi.array()
    .items(Joi.string())
    .required(),
  videoId: Joi.string().required(),
  delVideoIdList: Joi.array()
    .items(Joi.string())
    .required(),
});

export const BackendGetProductDetailSchema = Joi.object({
  productId: Joi.string().required(),
});

export const BackendDelProductSchema = Joi.object({
  productId: Joi.string().required(),
});

export const BackendUpdateProductStatus = Joi.object({
  productId: Joi.string().required(),
  productStatus: Joi.string()
    .allow(EProductStatus.OFF_SHELF, EProductStatus.PUT_ON_SHELF)
    .required(),
});
