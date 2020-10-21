/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-27 14:51:14
 * @LastEditTime: 2020-10-21 16:34:13
 * @FilePath: /koala-server/src/backstage/schema/BackendOrderSchema.ts
 */
import * as Joi from '@hapi/joi';
import { EOrderType } from 'src/global/enums/EOrder';
import { EDefaultSelect } from 'src/global/enums/EProduct';
export const GetOrderListSchema = Joi.object({
  orderId: Joi.string()
    .required()
    .allow(''),
  minOrderAmount: Joi.number().required(),
  maxOrderAmount: Joi.number().required(),
  minOrderCreateDate: Joi.string()
    .allow('')
    .required(),
  maxOrderCreateDate: Joi.string()
    .allow('')
    .required(),
  orderType: Joi.string()
    .allow(
      EDefaultSelect.ALL,
      EOrderType.CANCEL,
      EOrderType.CANCEL,
      EOrderType.FINISHED,
      EOrderType.PENDING_PAYMENT,
      EOrderType.TO_BE_DELIVERED,
      EOrderType.TO_BE_RECEIVED,
    )
    .required(),
  userId: Joi.allow(
    Joi.number(),
    Joi.string().allow(EDefaultSelect.ALL),
  ).required(),
  page: Joi.number().required(),
  pageSize: Joi.number().required(),
});

export const GetOrderDetailSchema = Joi.object({
  orderId: Joi.string().required(),
});

export const UpdateOrderLogisticsInfoSchema = Joi.object({
  orderId: Joi.string().required(),
  name: Joi.string().required(),
  code: Joi.string().required(),
  num: Joi.string().required(),
});

export const ReturnOfGoodsSchema = Joi.object({
  orderId:Joi.string().required()
})