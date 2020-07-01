/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 15:28:53
 * @LastEditTime: 2020-07-01 18:55:21
 * @FilePath: /koala-background-server/src/global/form/User.ts
 */
import { EUserGender, EUserLanguage } from '../enums/EUserGlobal';

export interface IFrontUser {
  nickName: string;
  avatarUrl: string;
  gender: EUserGender;
  country: string;
  province: string;
  city: string;
  language: EUserLanguage;
}

// 小程序用户登录字段
export interface IFrontUserLogin extends IFrontUser {
  code: string;
}

// 小程序用户存储
export interface IFrontUserSave extends IFrontUser {
  openid: string;
  sessionKey: string;
}
