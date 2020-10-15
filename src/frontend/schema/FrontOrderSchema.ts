/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:42:42
 * @LastEditTime: 2020-10-15 18:06:50
 * @FilePath: /koala-server/src/frontend/schema/FrontOrderSchema.ts
 */
import * as Joi from '@hapi/joi';
import { EOrderType } from 'src/global/enums/EOrder';

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

export const GetOrderListSchema = Joi.object({
  page: Joi.number().required(),
  orderType: Joi.string()
    .allow(
      EOrderType.PENDING_PAYMENT,
      EOrderType.TO_BE_DELIVERED,
      EOrderType.TO_BE_RECEIVED,
      EOrderType.COMMENT,
      'ALL',
    )
    .required(),
});
