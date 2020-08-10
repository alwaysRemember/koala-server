/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-07 15:49:07
 * @LastEditTime: 2020-08-10 16:54:38
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
} from '@nestjs/common';
import { BackendAppletHomeBannerService } from '../service/BackendAppletHomeBannerService';
import { SetPermissionsForController } from '../utils';
import { EBackendUserType } from '../enums/EBackendUserType';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import { AppletHomeRemoveBannerImgSchema } from '../schema/BackendAppletHomeSchema';

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
  public async uploadBannerImg(@UploadedFile() file) {
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
  public async removeBannerImg(@Body() { id }: { id: string }) {
    const result = new ResultVoUtil();
    try {
      await this.appletHomeBannerService.removeBannerImg(id);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }
}
