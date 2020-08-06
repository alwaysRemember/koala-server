/*
 * 后台管理员
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-01 18:48:25
 * @LastEditTime: 2020-08-06 17:23:44
 * @FilePath: /koala-server/src/backstage/controller/BackendUserController.ts
 */
import {
  Controller,
  Post,
  UsePipes,
  Body,
  HttpCode,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import * as jwt from 'jwt-simple';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import {
  BackendUserSchema,
  BackendUserChangePasswordSchema,
  BackendAddUserSchema,
  BackendUserListSchema,
  BackendUpdateAdminUserSchema,
  BackendDeleteAdminUserSchema,
  BackendBindAppletUserSchema,
} from 'src/backstage/schema/BackendUserSchema';
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { ETokenEnums } from 'src/backstage/enums/TokenEnums';
import {
  IBackendUserForm,
  IBackendUserChangePasswordForm,
  IBackendUserListForm,
  IBackendUserLoginForm,
} from 'src/backstage/form/BackendUserForm';
import { SetPermissionsForController } from '../utils';
import {
  EBackendUserType,
} from '../enums/EBackendUserType';
import { BackendUserService } from '../service/BackendUserService';
import { RedisCacheService } from '../service/RedisCacheService';
import { IBindAppletUser } from '../interface/IBackendUser';

@Controller('/backend-user')
export class BackendUserController {
  constructor(
    private readonly backendUserService: BackendUserService,
    private readonly redisService: RedisCacheService,
  ) {}

  /**
   * 后台登录接口
   * @param res
   * @param user
   */
  @UsePipes(new ReqParamCheck(BackendUserSchema, ({ type }) => type === 'body'))
  @HttpCode(200)
  @Post('/login')
  public async backendLogin(@Body() user: IBackendUserLoginForm) {
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
        userType: data.userType,
        username: data.username,
      });
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 修改用户密码
   * @param user
   */
  @UsePipes(
    new ReqParamCheck(
      BackendUserChangePasswordSchema,
      ({ type }) => type === 'body',
    ),
  )
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.PROXY)
  @Post('/change-password')
  public async bakcendChangePassword(
    @Body() user: IBackendUserChangePasswordForm,
  ) {
    const result = new ResultVoUtil();
    try {
      await this.backendUserService.backendChangePassword(user);
      return result.success(null);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 新增代理
   * @param user
   */
  @UsePipes(
    new ReqParamCheck(BackendAddUserSchema, ({ type }) => type === 'body'),
  )
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('/add-user')
  public async backendAddUser(@Body() user: IBackendUserForm) {
    const result = new ResultVoUtil();
    try {
      await this.backendUserService.backendAddUser(user);
      return result.success(null);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 代理列表
   * @param params
   */
  @UsePipes(
    new ReqParamCheck(BackendUserListSchema, ({ type }) => type === 'body'),
  )
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('/find-user-list')
  public async backendFindUserList(@Body() params: IBackendUserListForm) {
    const result = new ResultVoUtil();

    try {
      // 获取查询的数据
      const {
        list,
        total,
      } = await this.backendUserService.backendFindUserListWithParams(params);

      return result.success({
        total,
        list,
      });
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 获取所有用户数据
   */
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Get('/get-all-user-list')
  public async backendGetAllUserList() {
    const result = new ResultVoUtil();
    try {
      const list = await this.backendUserService.backendFindUserList();
      return result.success(list);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 更新管理员信息
   * @param user
   */
  @UsePipes(
    new ReqParamCheck(
      BackendUpdateAdminUserSchema,
      ({ type }) => type === 'body',
    ),
  )
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('/update-admin-user')
  public async backendUpdateAdminUser(@Req() req, @Body() user: BackendUser) {
    const result = new ResultVoUtil();

    // 获取当前登录的用户id
    const { userId }: BackendUser = JSON.parse(
      await this.redisService.get(req.headers['token'] as string),
    );
    // 限制当前用户操作
    if (user.userId === userId) {
      return result.error('不能对自己的账号进行操作!');
    }
    try {
      await this.backendUserService.backendUpdateAdminUser(user);
      return result.success(null);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 删除管理员
   * @param param0
   */
  @UsePipes(
    new ReqParamCheck(
      BackendDeleteAdminUserSchema,
      ({ type }) => type === 'body',
    ),
  )
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('/delete-admin-user')
  public async backendDeleteAdminUser(
    @Req() req,
    @Body() { userId }: { userId: number },
  ) {
    const result = new ResultVoUtil();

    // 获取当前登录的用户id
    const user: BackendUser = JSON.parse(
      await this.redisService.get(req.headers['token'] as string),
    );
    // 限制当前用户操作
    if (user.userId === userId) {
      return result.error('不能对自己的账号进行操作!');
    }
    try {
      await this.backendUserService.backendDeleteAdminUser(userId);
      return result.success(null);
    } catch (e) {
      return result.error(e.meesage);
    }
  }

  /**
   * 后台用户和小程序用户关联
   * @param params
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      BackendBindAppletUserSchema,
      ({ type }) => type === 'body',
    ),
  )
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('/bind-applet-user')
  public async bindAppletUser(@Body() params: IBindAppletUser) {
    const result = new ResultVoUtil();
    try {
      await this.backendUserService.bindAppletUser(params);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }
}
