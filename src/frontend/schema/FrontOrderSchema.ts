/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:42:42
 * @LastEditTime: 2020-09-24 16:17:46
 * @FilePath: /koala-server/src/frontend/schema/FrontOrderSchema.ts
 */
import * as Joi from '@hapi/joi';

export const CreateOrderSchema = Joi.object({
  buyProductList: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        buyQuantity: Joi.number().required(),
        selectProductConfigList: Joi.array()
          .items(Joi.number())
          .required(),
        remarks: Joi.string()
          .allow('')
          .required(),
      }),
    )
    .min(1)
    .required(),
  addressId: Joi.number().required(),
});

export const GetOrderSchema = Joi.object({
  payOrderId: Joi.string().required(),
});
