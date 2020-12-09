/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 15:21:13
 * @LastEditTime: 2020-12-09 14:13:58
 * @FilePath: /koala-server/src/frontend/schema/FrontUserSchema.ts
 */

import * as Joi from '@hapi/joi';
import { EUserGender, EUserLanguage } from '../../global/enums/EUserGlobal';
export const UserLoginSchema = Joi.object({
  code: Joi.string().required(),
  nickName: Joi.string().allow(""),
  avatarUrl: Joi.string().allow(""),
  gender: Joi.number()
    .valid(EUserGender.UNKONWN, EUserGender.MAN, EUserGender.WOMAN)
    .default(EUserGender.UNKONWN),
  country: Joi.string().allow(""),
  province: Joi.string().allow(""),
  city: Joi.string().allow(""),
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
