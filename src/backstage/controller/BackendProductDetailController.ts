/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:18:57
 * @LastEditTime: 2020-07-20 14:10:03
 * @FilePath: /koala-server/src/backstage/controller/BackendProductDetailController.ts
 */
import {
  Controller,
  Post,
  UploadedFile,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { BackendProductDetailServiceImpl } from '../service/impl/BackendProductDetailServiceImpl';
import { SetPermissionsForController } from '../utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { EBackendUserType } from '../enums/EBackendUserType';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';

@Controller('/product')
export class BackendProductDetailController {
  constructor(
    private readonly backendProductDetailService: BackendProductDetailServiceImpl,
  ) {}

  /**
   * 上传产品banner
   * @param file
   */
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.PROXY)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload-product-banner')
  public async uploadProductBanner(@UploadedFile() file) {
    const result = new ResultVoUtil();

    if (!file) {
      return result.error('请选择上传的文件');
    }
    try {
      const data = await this.backendProductDetailService.uploadProductBanner(
        file,
      );

      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 上传产品视频
   * @param file
   */
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.PROXY)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload-product-video')
  public async uploadProductVideo(@UploadedFile() file) {
    const result = new ResultVoUtil();
    if (!file) {
      return result.error('请选择上传的文件');
    }
    try {
      const data = await this.backendProductDetailService.uploadProductVideo(
        file,
      );
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
