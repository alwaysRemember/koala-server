/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-09 17:32:12
 * @LastEditTime: 2020-07-28 11:54:26
 * @FilePath: /koala-server/src/backstage/controller/BackendAppletUsersController.ts
 */
import {
  Controller,
  Get,
  HttpCode,
  UsePipes,
  Post,
  Body,
} from '@nestjs/common';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import { BackendAppletUsersListRequestSchema } from '../schema/BackendAppletUsersSchema';
import { SetPermissionsForController } from '../utils';
import { EBackendUserType } from '../enums/EBackendUserType';
import { IBackendAppletUsersListRequestParams } from '../form/BackendAppletUsersForm';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { BackendAppletUsersService } from '../service/BackendAppletUsersService';

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
}
