/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-09 17:32:12
 * @LastEditTime: 2020-08-06 14:19:06
 * @FilePath: /koala-server/src/backstage/controller/BackendAppletUsersController.ts
 */
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { EBackendUserType } from '../enums/EBackendUserType';
import { IBackendAppletUsersListRequestParams } from '../form/BackendAppletUsersForm';
import {
  BackendAppletUsersListRequestSchema,
  BackendGetUserForPhoneSchema,
} from '../schema/BackendAppletUsersSchema';
import { BackendAppletUsersService } from '../service/BackendAppletUsersService';
import { SetPermissionsForController } from '../utils';

@Controller('/backend-applet-user')
export class BackendAppletUsersController {
  constructor(
    private readonly backendAppletUsersService: BackendAppletUsersService,
  ) {}

  /**
   * 获取小程序用户列表
   * @param params
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      BackendAppletUsersListRequestSchema,
      ({ type }) => type === 'body',
    ),
  )
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('/get-applet-user-list')
  public async getAppletUserList(
    @Body() params: IBackendAppletUsersListRequestParams,
  ) {
    const result = new ResultVoUtil();

    try {
      const {
        list,
        total,
      } = await this.backendAppletUsersService.getAppletUserList(params);
      return result.success({
        total,
        list,
      });
    } catch (e) {
      return result.error(e.message);
    }
  }

  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      BackendGetUserForPhoneSchema,
      ({ type }) => type === 'body',
    ),
  )
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('get-user-for-phone')
  public async getUserForPhone(@Body() { phone }: { phone: string }) {
    const result = new ResultVoUtil();
    try {
      const list = await this.backendAppletUsersService.getUserForPhone(phone);
      return result.success(list);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
