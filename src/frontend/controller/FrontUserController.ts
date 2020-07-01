/*
 * 前端用户接口
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-22 17:31:07
 * @LastEditTime: 2020-06-28 15:13:15
 * @FilePath: /koala-background-server/src/frontend/controller/FrontUserController.ts
 */
import { Controller, Post, HttpCode, UsePipes, Body } from '@nestjs/common';
import axios from 'axios';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { ReqParamCheck } from 'src/pips/ReqParamCheck';
import { FrontUserLoginSchema } from 'src/global/schema/FrontUserSchema';
import { IFrontUserLogin, IFrontUserSave } from 'src/global/form/FrontUser';
import { FrontUserServiceImpl } from 'src/global/service/impl/FrontUserServiceImpl';
import { appId, AppSecret } from 'src/config/projectConfig';
import { FrontUser } from 'src/global/dataobject/FrontUser.entity';

@Controller('/front')
export class Logincontroller {
  constructor(private readonly frontUserService: FrontUserServiceImpl) {}

  @HttpCode(200)
  @Post('/login')
  @UsePipes(
    new ReqParamCheck(FrontUserLoginSchema, ({ type }) => type === 'body'),
  )
  public async login(@Body() user: IFrontUserLogin) {
    const result = new ResultVoUtil();
    try {
      // 获取openid session_key
      const { data } = await axios.get(
        'https://api.weixin.qq.com/sns/jscode2session',
        {
          params: {
            appid: appId,
            secret: AppSecret,
            js_code: user.code,
            grant_type: 'authorization_code',
          },
        },
      );
      // 判断是否失败
      if (data.errcode && data.errcode !== 0)
        return result.error('登录失败，请稍后重试');

      // 删除code字段
      delete user.code;

      // 用户信息以及用户标识合并
      const userInfo: IFrontUserSave = Object.assign({}, user, {
        openid: data.openid,
        sessionKey: data.session_key,
      });

      // 用户入库
      const saveUserInfo: FrontUser = await this.frontUserService.save(
        userInfo,
      );
      return result.success(saveUserInfo);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
