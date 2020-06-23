/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 15:21:13
 * @LastEditTime: 2020-06-23 15:29:25
 * @FilePath: /koala-background-server/src/global/schema/FrontUserSchema.ts
 */

import * as Joi from '@hapi/joi';
import { EUserGender, EUserLanguage } from '../enums/EUserGlobal';
export const FrontUserLoginSchema = Joi.object({
  code: Joi.string().required(),
  nickName: Joi.string().required(),
  avatarUrl: Joi.string().required(),
  gender: Joi.number()
    .valid(EUserGender.UNKONWN, EUserGender.MAN, EUserGender.WOMAN)
    .default(EUserGender.UNKONWN),
  country: Joi.string().required(),
  province: Joi.string().required(),
  city: Joi.string().required(),
  language: Joi.string()
    .valid(EUserLanguage.EN, EUserLanguage.ZH_CN, EUserLanguage.ZH_TW)
    .default(EUserLanguage.EN),
});
