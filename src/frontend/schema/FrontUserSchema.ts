/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 15:21:13
 * @LastEditTime: 2020-12-09 11:55:00
 * @FilePath: /koala-server/src/frontend/schema/FrontUserSchema.ts
 */

import * as Joi from '@hapi/joi';
import { EUserGender, EUserLanguage } from '../../global/enums/EUserGlobal';
export const UserLoginSchema = Joi.object({
  code: Joi.string().required(),
  nickName: Joi.string(),
  avatarUrl: Joi.string(),
  gender: Joi.number()
    .valid(EUserGender.UNKONWN, EUserGender.MAN, EUserGender.WOMAN)
    .default(EUserGender.UNKONWN),
  country: Joi.string(),
  province: Joi.string(),
  city: Joi.string(),
  language: Joi.string()
    .valid(EUserLanguage.EN, EUserLanguage.ZH_CN, EUserLanguage.ZH_TW)
    .default(EUserLanguage.EN),
});

export const UpdateUserPhone = Joi.object({
  iv: Joi.string().required(),
  encryptedData: Joi.string().required(),
});

export const GetMyCommentSchema = Joi.object({
  page: Joi.number()
    .min(1)
    .required(),
});
