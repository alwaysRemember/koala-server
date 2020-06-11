/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-02 11:22:22
 * @LastEditTime: 2020-06-11 16:03:30
 * @FilePath: /koala-background-server/src/schema/BackendUserSchema.ts
 */

import * as Joi from '@hapi/joi';

export const BackendUserSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .required(),
  password: Joi.string().required(),
});
