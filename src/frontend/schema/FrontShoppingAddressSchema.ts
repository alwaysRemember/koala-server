/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-14 16:07:04
 * @LastEditTime: 2020-09-14 16:14:59
 * @FilePath: /koala-server/src/frontend/schema/FrontShoppingAddressSchema.ts
 */
import * as Joi from '@hapi/joi';

export const AddShoppingAddressSchema = Joi.object({
  id: Joi.number(),
  name: Joi.string().required(),
  phone: Joi.string()
    .regex(/^1[3|4|5|7|8][0-9]{9}$/)
    .required(),
  area: Joi.array()
    .items(Joi.string())
    .min(1)
    .required(),
  address: Joi.string().required(),
  isDefaultSelection: Joi.boolean().required(),
});
