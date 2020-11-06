/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-20 16:03:50
 * @LastEditTime: 2020-11-06 15:37:02
 * @FilePath: /koala-server/src/frontend/schema/FrontProductSchema.ts
 */
import * as Joi from '@hapi/joi';

export const GetProductDetailSchema = Joi.object({
  productId: Joi.string().required(),
});

export const FavoriteProductType = Joi.object({
  productId: Joi.string().required(),
  favoriteType: Joi.boolean().required(),
});

export const GetProductCommentSchema = Joi.object({
  productId: Joi.string().required(),
});
