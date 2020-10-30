/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:42:42
 * @LastEditTime: 2020-10-30 15:27:04
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

export const CancelOrderSchema = Joi.object({
  orderId: Joi.string().required(),
});

export const OrderPaymentSchema = Joi.object({
  orderId: Joi.string().required(),
});

export const ReturnOfGoodsSchema = Joi.object({
  orderId: Joi.string().required(),
  reason: Joi.string().required(),
});

export const ConfirmOrderSchema = Joi.object({
  orderId: Joi.string().required(),
});

export const RefundCourierInfoSchema = Joi.object({
  courierName: Joi.string().required(),
  courierNum: Joi.string().required(),
  orderId: Joi.string().required(),
});

export const GetLogiticsInfoSchema = Joi.object({
  orderId: Joi.string().required(),
});

export const SubmitOrderComment = Joi.object({
  orderId: Joi.string().required(),
  productList: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      rate: Joi.number()
        .min(1)
        .max(5)
        .required(),
      text: Joi.string()
        .allow('')
        .required(),
    }).required(),
  ),
});

export const SearchOrderSchema = Joi.object({
  page: Joi.number()
    .min(1)
    .required(),
  searchValue: Joi.string().required(),
});
