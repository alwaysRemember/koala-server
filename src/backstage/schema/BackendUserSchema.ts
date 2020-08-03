/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-02 11:22:22
 * @LastEditTime: 2020-08-03 17:10:26
 * @FilePath: /koala-server/src/backstage/schema/BackendUserSchema.ts
 */

import * as Joi from '@hapi/joi';

// 校验登录
export const BackendUserSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(6)
    .max(11)
    .required(),
  password: Joi.string().required(),
});

// 添加用户
export const BackendAddUserSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(6)
    .max(11)
    .required(),
  password: Joi.string().required(),
  userType: Joi.number().required(),
  email: Joi.string()
    .email()
    .required(),
});

// 修改密码
export const BackendUserChangePasswordSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(6)
    .max(11)
    .required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

// 用户列表查询
export const BackendUserListSchema = Joi.object({
  username: Joi.string()
    .allow('')
    .max(11)
    .optional(),
  userType: Joi.number(),
  page: Joi.number()
    .required()
    .min(1),
  number: Joi.number()
    .required()
    .min(1),
});

// 更新用户数据
export const BackendUpdateAdminUserSchema = Joi.object({
  userId: Joi.number().required(),
  username: Joi.string()
    .alphanum()
    .min(6)
    .max(11)
    .required(),
  userType: Joi.number().required(),
  password: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
});

export const BackendDeleteAdminUserSchema = Joi.object({
  userId: Joi.number().required(),
});
