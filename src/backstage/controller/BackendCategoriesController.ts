/*
 * 后台商品分类功能
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 17:35:34
 * @LastEditTime: 2020-07-09 16:49:03
 * @FilePath: /koala-server/src/backstage/controller/BackendCategoriesController.ts
 */

import {
  Controller,
  Get,
  Post,
  UsePipes,
  UseInterceptors,
  UploadedFile,
  Body,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import {
  BackendAddCategoriesSchema,
  BackendCategoriesListSchema,
  BackendUpdateCategoriesSchema,
} from '../schema/BackendCategoriesSchema';
import {
  IAddCategories,
  ICategoriesList,
  IUpdateCategories,
} from '../form/BackendCategoriesForm';
import { BackendCategoriesServiceImpl } from '../service/impl/BackendCategoriesServiceImpl';
import { SetPermissionsForController } from '../utils';
import { EBackendUserType } from '../enums/EBackendUserType';

@Controller('/backend-categories')
export class BackendCategoriesController {
  constructor(
    private readonly backendCategoriesService: BackendCategoriesServiceImpl,
  ) {}

  /**
   * 创建商品类别标签
   * @param file
   * @param data
   */
  @UsePipes(
    new ReqParamCheck(
      BackendAddCategoriesSchema,
      ({ type }) => type === 'body',
    ),
  )
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('/add-categories')
  @UseInterceptors(FileInterceptor('file'))
  public async createClassification(
    @UploadedFile() file,
    @Body() data: IAddCategories,
  ) {
    const result = new ResultVoUtil();
    try {
      await this.backendCategoriesService.save(file, data);
      return result.success();
    } catch (e) {
      return result.error('系统错误，请稍后重试');
    }
  }

  /**
   * 获取商品标签分类列表
   * @param data
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      BackendCategoriesListSchema,
      ({ type }) => type === 'body',
    ),
  )
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('/get-categories')
  public async classificationList(@Body() data: ICategoriesList) {
    const result = new ResultVoUtil();
    try {
      const total = await (
        await this.backendCategoriesService.getAllCagetories()
      ).length;
      const list = await this.backendCategoriesService.getCagegoriesList(data);
      return result.success({
        total,
        list,
      });
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 更新商品分类标签信息
   * @param params
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      BackendUpdateCategoriesSchema,
      ({ type }) => type === 'body',
    ),
  )
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('/update-categories')
  public async updateCategories(@Body() params: IUpdateCategories) {
    const result = new ResultVoUtil();
    try {
      await this.backendCategoriesService.updateCategories(params);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }
}
