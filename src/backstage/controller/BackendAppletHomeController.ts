/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-07 15:49:07
 * @LastEditTime: 2020-09-17 15:34:25
 * @FilePath: /koala-server/src/backstage/controller/BackendAppletHomeController.ts
 */
import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  UsePipes,
  Get,
} from '@nestjs/common';
import { BackendAppletHomeBannerService } from '../service/BackendAppletHomeBannerService';
import { SetPermissionsForController } from '../utils';
import { EBackendUserType } from '../enums/EBackendUserType';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import {
  AppletHomeRemoveBannerImgSchema,
  AppletHomeAddBannerSchema,
  AppletHomeDeleteBannerSchema,
} from '../schema/BackendAppletHomeSchema';
import {
  IAppletHomeAddBannerResponse,
  IAppletHomeGetBannerListResponseItem,
} from '../interface/IAppletHome';
import { ResultVo } from 'src/global/viewobject/ResultVo';
import { IAppletHomeAddBannerRequest } from '../form/BackendAppletUsersForm';

@Controller('/applet-home')
export class BackendAppletHomeController {
  constructor(
    private readonly appletHomeBannerService: BackendAppletHomeBannerService,
  ) {}

  /**
   * 上传banner图
   * @param file
   */
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload-banner-img')
  public async uploadBannerImg(
    @UploadedFile() file,
  ): Promise<ResultVo<IAppletHomeAddBannerResponse>> {
    const result = new ResultVoUtil();
    if (!file) {
      return result.error('请选择上传的图片');
    }
    try {
      const data = await this.appletHomeBannerService.uploadBannerImg(file);
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 删除banner图片
   * @param params
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      AppletHomeRemoveBannerImgSchema,
      ({ type }) => type === 'body',
    ),
  )
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('/remove-banner-img')
  public async removeBannerImg(
    @Body() { id }: { id: string },
  ): Promise<ResultVo<null>> {
    const result = new ResultVoUtil();
    try {
      await this.appletHomeBannerService.removeBannerImg(id);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 新增banner
   * @param params
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(AppletHomeAddBannerSchema, ({ type }) => type === 'body'),
  )
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('/add-banner')
  public async addBanner(
    @Body() params: IAppletHomeAddBannerRequest,
  ): Promise<ResultVo<null>> {
    const result = new ResultVoUtil();
    try {
      await this.appletHomeBannerService.addBanner(params);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 获取banner列表
   */
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Get('get-banner-list')
  public async getBannerList(): Promise<
    ResultVo<Array<IAppletHomeGetBannerListResponseItem>>
  > {
    const result = new ResultVoUtil();
    try {
      const list = await this.appletHomeBannerService.getBannerList();
      return result.success(list);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 删除banner
   * @param param0
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      AppletHomeDeleteBannerSchema,
      ({ type }) => type === 'body',
    ),
  )
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('/delete-banner')
  public async deleteBanner(
    @Body() { id }: { id: number },
  ): Promise<ResultVo<null>> {
    const result = new ResultVoUtil();
    try {
      await this.appletHomeBannerService.deleteBanner(id);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }
}
