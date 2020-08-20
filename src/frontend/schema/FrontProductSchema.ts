/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-20 16:03:50
 * @LastEditTime: 2020-08-20 16:04:29
 * @FilePath: /koala-server/src/frontend/schema/FrontProduct.ts
 */
import * as Joi from '@hapi/joi';

export const GetProductDetailSchema = Joi.object({
  productId: Joi.string().required(),
});
