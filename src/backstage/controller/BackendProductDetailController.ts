/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:18:57
 * @LastEditTime: 2020-09-17 15:53:02
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
  BackendDelProductSchema,
  BackendUpdateProductStatus,
} from '../schema/BackendProductDetailSchema';
import { BackendProductService } from '../service/BackendProductService';
import {
  IProductResponse,
  IUpdateProductStatus,
} from '../interface/IProductDetail';
import { ResultVo } from 'src/global/viewobject/ResultVo';

@Controller('/product')
export class BackendProductDetailController {
  constructor(private readonly backendProductService: BackendProductService) {}

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
      const data = await this.backendProductService.uploadProductVideo(file);
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 上传产品主图
   * @param file
   */
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.PROXY)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload-product-main-img')
  public async uploadProductMainImg(@UploadedFile() file) {
    const result = new ResultVoUtil();
    if (!file) {
      return result.error('请选择上传的文件');
    }
    try {
      const data = await this.backendProductService.uploadProductMainImg(file);
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
  ): Promise<ResultVo<{id:string}>> {
    const result = new ResultVoUtil();
    try {
      const id = await this.backendProductService.uploadProduct(data, token);
      return result.success<{id:string}>({ id });
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 获取商品详情
   * @param param0
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      BackendGetProductDetailSchema,
      ({ type }) => type === 'body',
    ),
  )
  @SetPermissionsForController(EBackendUserType.PROXY)
  @Post('/get-product-detail')
  public async getProductDetail(
    @Body() { productId }: { productId: string },
  ): Promise<ResultVo<IProductResponse>> {
    const result = new ResultVoUtil();
    try {
      const data = await this.backendProductService.getProductDetail(productId);
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 删除产品
   * @param param0
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(BackendDelProductSchema, ({ type }) => type === 'body'),
  )
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('del-product')
  public async delProduct(@Body() { productId }: { productId: string }): Promise<ResultVo<null>>  {
    const result = new ResultVoUtil();
    try {
      await this.backendProductService.delProduct(productId);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 更新商品状态
   * @param params
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      BackendUpdateProductStatus,
      ({ type }) => type === 'body',
    ),
  )
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('/update-product-status')
  public async updatePorductStatus(@Body() params: IUpdateProductStatus): Promise<ResultVo<null>>  {
    const result = new ResultVoUtil();
    try {
      await this.backendProductService.updateProductStatus(params);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }
}
