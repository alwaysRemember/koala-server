/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:18:57
 * @LastEditTime: 2020-07-22 11:29:18
 * @FilePath: /koala-server/src/backstage/controller/BackendProductDetailController.ts
 */
import {
  Controller,
  Post,
  UploadedFile,
  HttpCode,
  UseInterceptors,
  Body,
  UsePipes,
  Req,
} from '@nestjs/common';
import { SetPermissionsForController } from '../utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { EBackendUserType } from '../enums/EBackendUserType';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { IProductDetail } from '../form/BackendProductDetailForm';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import {
  BackendProductDetailSchema,
  BackendGetProductDetailSchema,
} from '../schema/BackendProductDetailSchema';
import { BackendProductDetailService } from '../service/BackendProductDetailService';

@Controller('/product')
export class BackendProductDetailController {
  constructor(
    private readonly backendProductDetailService: BackendProductDetailService,
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

  /**
   * 上传产品
   * @param data
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      BackendProductDetailSchema,
      ({ type }) => type === 'body',
    ),
  )
  @SetPermissionsForController(EBackendUserType.PROXY)
  @Post('/upload-product')
  public async uploadProduct(
    @Body() data: IProductDetail,
    @Req() { headers: { token } },
  ) {
    const result = new ResultVoUtil();
    try {
      const id = await this.backendProductDetailService.uploadProduct(
        data,
        token,
      );
      return result.success({ id });
    } catch (e) {
      return result.error(e.message);
    }
  }

  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      BackendGetProductDetailSchema,
      ({ type }) => type === 'body',
    ),
  )
  @SetPermissionsForController(EBackendUserType.PROXY)
  @Post('/get-product-detail')
  public async getProductDetail(@Body() { productId }: { productId: number }) {
    const result = new ResultVoUtil();
    try {
      const data = await this.backendProductDetailService.getProductDetail(
        productId,
      );
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
