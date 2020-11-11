/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:40:49
 * @LastEditTime: 2020-11-11 14:42:20
 * @FilePath: /koala-server/src/frontend/schema/FrontFavoritesSchema.ts
 */
import * as Joi from '@hapi/joi';

export const GetFavoritesDataSchema = Joi.object({
  page: Joi.number()
    .min(1)
    .required(),
});
