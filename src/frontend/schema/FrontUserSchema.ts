/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 15:21:13
 * @LastEditTime: 2020-07-01 18:51:24
 * @FilePath: /koala-background-server/src/frontend/schema/FrontUserSchema.ts
 */

import * as Joi from '@hapi/joi';
import { EUserGender, EUserLanguage } from '../../global/enums/EUserGlobal';
export const UserLoginSchema = Joi.object({
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
