/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-02 11:22:22
 * @LastEditTime: 2020-06-15 17:42:11
 * @FilePath: /koala-background-server/src/schema/BackendUserSchema.ts
 */

import * as Joi from '@hapi/joi';

// 校验登录
export const BackendUserSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .required(),
  password: Joi.string().required(),
});

// 添加用户
export const BackendAddUserSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .required(),
  password: Joi.string().required(),
  userType: Joi.number().required(),
});

// 修改密码
export const BackendUserChangePasswordSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

// 用户列表查询
export const BackendUserListSchema = Joi.object({
  username: Joi.string()
    .allow('')
    .optional(),
  userType: Joi.number(),
  page: Joi.number()
    .required()
    .min(1),
  number: Joi.number()
    .required()
    .min(1),
});
