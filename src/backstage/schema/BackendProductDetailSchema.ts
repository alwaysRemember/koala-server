/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-20 16:23:02
 * @LastEditTime: 2020-07-20 17:39:01
 * @FilePath: /koala-server/src/backstage/schema/BackendProductDetailSchema.ts
 */

import * as Joi from '@hapi/joi';
import { EProductStatus } from 'src/global/enums/EProduct';

export const BackendProductDetailSchema = Joi.object({
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
  bannerIdList: Joi.array()
    .items(Joi.number())
    .required(),
  delBannerIdList: Joi.array()
    .items(Joi.number())
    .required(),
  videoId: Joi.any().required(),
  delVideoIdList: Joi.array()
    .items(Joi.number())
    .required(),
});
