/*
 * 前端用户接口
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-22 17:31:07
 * @LastEditTime: 2020-09-17 15:28:05
 * @FilePath: /koala-server/src/frontend/controller/FrontUserController.ts
 */
import {
  Controller,
  Post,
  HttpCode,
  UsePipes,
  Body,
  Req,
} from '@nestjs/common';
import axios from 'axios';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import {
  UserLoginSchema,
  UpdateUserPhone,
} from 'src/frontend/schema/FrontUserSchema';
import { IFrontUserLogin, IFrontUserSave } from 'src/global/form/User';
import { FrontUserService } from 'src/frontend/service/UserService';
import { appId, AppSecret } from 'src/config/projectConfig';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { IUpdateUserPhone } from '../interface/FrontUser';
import { ResultVo } from 'src/global/viewobject/ResultVo';

@Controller('/front')
export class FrontUserController {
  constructor(private readonly frontUserService: FrontUserService) {}

  /**
   * 小程序登录接口
   * @param user
   */
  @HttpCode(200)
  @Post('/login')
  @UsePipes(new ReqParamCheck(UserLoginSchema, ({ type }) => type === 'body'))
  public async login(
    @Body() user: IFrontUserLogin,
  ): Promise<ResultVo<FrontUser>> {
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

  /**
   * 更新用户的手机号
   * @param params
   */
  @HttpCode(200)
  @Post('/update-user-phone')
  @UsePipes(new ReqParamCheck(UpdateUserPhone, ({ type }) => type === 'body'))
  public async updateUserPhone(
    @Body() params: IUpdateUserPhone,
    @Req() req,
  ): Promise<ResultVo<{ phone: string }>> {
    const result = new ResultVoUtil();
    try {
      const { phone } = await this.frontUserService.updateUserPhone(
        params,
        req.headers.openid,
      );
      return result.success({ phone });
    } catch (e) {
      return result.error(e.message);
    }
  }
}
