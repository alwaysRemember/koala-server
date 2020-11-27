/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-27 15:17:41
 * @LastEditTime: 2020-11-27 18:08:17
 * @FilePath: /koala-server/src/frontend/schema/FrontShoppingCartSchema.ts
 */
import * as Joi from '@hapi/joi';

export const SaveProductToShoppingCartSchema = Joi.object({
  productId: Joi.string().required(),
  buyQuantity: Joi.number()
    .min(1)
    .required(),
  buyConfigList: Joi.array()
    .items(Joi.number())
    .required(),
});

export const DeleteProductForShoppingCartSchema = Joi.object({
  idList: Joi.array()
    .items(Joi.string())
    .required(),
});
