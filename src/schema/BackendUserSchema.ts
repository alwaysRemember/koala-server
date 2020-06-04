/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-02 11:22:22
 * @LastEditTime: 2020-06-04 18:37:57
 * @FilePath: /koala-background-server/src/schema/BackendUserSchema.ts
 */

import * as Joi from '@hapi/joi';

export const BackendUserSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .required(),
  password: Joi.string()
    .alphanum()
    .min(6)
    .max(16)
    .required(),
});
