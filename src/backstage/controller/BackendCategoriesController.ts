/*
 * 后台商品分类功能
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 17:35:34
 * @LastEditTime: 2020-07-07 19:06:54
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
import { BackendAddCategoriesSchema } from '../schema/BackendCategoriesSchema';
import { IAddCategories } from '../form/BackendCategoriesForm';
import { BackendCategoriesServiceImpl } from '../service/impl/BackendCategoriesServiceImpl';

@Controller('/backend-categories')
export class BackendCategoriesController {
  constructor(
    private readonly backendCategoriesService: BackendCategoriesServiceImpl,
  ) {}

  @UsePipes(
    new ReqParamCheck(
      BackendAddCategoriesSchema,
      ({ type }) => type === 'body',
    ),
  )
  @HttpCode(200)
  @Post('/add-categories')
  @UseInterceptors(FileInterceptor('file'))
  public async createClassification(
    @UploadedFile() file,
    @Body() data: IAddCategories,
  ) {
    const result = new ResultVoUtil();
    try {
      this.backendCategoriesService.save(file, data);
      return result.success();
    } catch (e) {
      return result.error('系统错误，请稍后重试');
    }
  }
}
