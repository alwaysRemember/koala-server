/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-11 15:59:38
 * @LastEditTime: 2020-06-11 16:03:22
 * @FilePath: /koala-background-server/src/schema/BackendAddUserSchema.ts
 */

import * as Joi from '@hapi/joi';

export const BackendAddUserSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .required(),
  password: Joi.string().required(),
  userType: Joi.number().required(),
});
