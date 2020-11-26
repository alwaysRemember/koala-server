/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-20 16:03:50
 * @LastEditTime: 2020-11-26 15:15:18
 * @FilePath: /koala-server/src/frontend/schema/FrontProductSchema.ts
 */
import * as Joi from '@hapi/joi';
import { EProductSortType } from 'src/global/enums/EProduct';

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

export const GetProductListSchema = Joi.object({
  categoriesId: Joi.string(),
  searchName: Joi.string().required(),
  productSortType: Joi.string()
    .allow(
      EProductSortType.AMOUNT_ASE,
      EProductSortType.AMOUNT_DESC,
      EProductSortType.SALES,
    )
    .required(),
  page: Joi.number().required(),
});
