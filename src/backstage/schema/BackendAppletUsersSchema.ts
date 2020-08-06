/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-09 17:54:50
 * @LastEditTime: 2020-08-06 14:10:52
 * @FilePath: /koala-server/src/backstage/schema/BackendAppletUsersSchema.ts
 */

import * as Joi from '@hapi/joi';
import { join } from 'path';

export const BackendAppletUsersListRequestSchema = Joi.object({
  page: Joi.number().required(),
  pageSize: Joi.number().required(),
});

export const BackendGetUserForPhoneSchema = Joi.object({
  phone: Joi.string().required(),
});
