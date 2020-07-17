/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:18:57
 * @LastEditTime: 2020-07-17 16:12:23
 * @FilePath: /koala-server/src/backstage/controller/BackendProductController.ts
 */
import {
  Controller,
  Post,
  UploadedFile,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { BackendProductServiceImpl } from '../service/impl/BackendProductServiceImpl';
import { SetPermissionsForController } from '../utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { EBackendUserType } from '../enums/EBackendUserType';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';

@Controller('/product')
export class BackendProductController {
  constructor(
    private readonly backendProductService: BackendProductServiceImpl,
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
      const data = await this.backendProductService.uploadProductBanner(file);

      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
