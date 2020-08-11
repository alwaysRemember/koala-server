/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-10 16:51:22
 * @LastEditTime: 2020-08-10 17:48:11
 * @FilePath: /koala-server/src/backstage/schema/BackendAppletHomeSchema.ts
 */
import * as Joi from '@hapi/joi';

export const AppletHomeRemoveBannerImgSchema = Joi.object({
  id: Joi.number().required(),
});

export const AppletHomeAddBannerSchema = Joi.object({
  productId: Joi.string().required(),
  bannerImgId: Joi.number().required(),
});
