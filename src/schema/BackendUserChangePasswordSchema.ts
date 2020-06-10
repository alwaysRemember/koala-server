/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-10 13:48:46
 * @LastEditTime: 2020-06-10 13:50:04
 * @FilePath: /koala-background-server/src/schema/BackendUserChangePasswordSchema.ts
 */

import * as Joi from '@hapi/joi';

export const BackendUserChangePasswordSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});
