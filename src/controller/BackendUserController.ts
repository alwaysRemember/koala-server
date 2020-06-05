/*
 * 后台管理员
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-01 18:48:25
 * @LastEditTime: 2020-06-05 16:20:45
 * @FilePath: /koala-background-server/src/controller/BackendUserController.ts
 */
import { Controller, Get, Post, UsePipes, Req, Body } from '@nestjs/common';
import * as jwt from 'jwt-simple';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { ReqParamCheck } from 'src/pips/ReqParamCheck';
import { BackendUserSchema } from 'src/schema/BackendUserSchema';
import { BackendUserLoginForm } from 'src/form/BackendUserLoginForm';
import { BackendUser } from 'src/dataobject/BackendUser.entity';
import { BackendUserServiceImpl } from 'src/service/impl/BackendUserServiceImpl';
import { ETokenEnums } from 'src/enums/TokenEnums';
import { RedisCacheServiceImpl } from 'src/service/impl/RedisCacheServiceImpl';

@Controller('/backend-user')
export class BackendUserController {
  constructor(
    private readonly backendUserService: BackendUserServiceImpl,
    private readonly redisService: RedisCacheServiceImpl,
  ) {}

  /**
   * 后台登录接口
   * @param res
   * @param user
   */
  @UsePipes(new ReqParamCheck(BackendUserSchema, ({ type }) => type === 'body'))
  @Post('/login')
  public async backendLogin(@Req() res, @Body() user: BackendUserLoginForm) {
    const result = new ResultVoUtil();
    try {
      const data: BackendUser = await this.backendUserService.backendLogin(
        user,
      );
      const token: string = jwt.encode(data, ETokenEnums.TOKEN_SECRET);

      // 登录态存入redis
      this.redisService.set(
        token,
        JSON.stringify(data),
        ETokenEnums.TOKEN_EXPIRATION_TIME,
      );

      return result.success({
        token,
        auth: data.user_type,
      });
    } catch (e) {
      return result.error(e.message);
    }
  }
}
