/*
 * 后台商品分类功能
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 17:35:34
 * @LastEditTime: 2020-09-17 15:52:14
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
  BackendUpdateCategoriesSchema,
  BackendCategoriesListSchema,
} from '../schema/BackendCategoriesSchema';
import {
  IAddCategories,
  ICategoriesList,
  IUpdateCategories,
} from '../form/BackendCategoriesForm';
import { SetPermissionsForController } from '../utils';
import { EBackendUserType } from '../enums/EBackendUserType';
import { BackendCategoriesService } from '../service/BackendCategoriesService';
import { ResultVo } from 'src/global/viewobject/ResultVo';
import { Categories } from 'src/global/dataobject/Categories.entity';

@Controller('/backend-categories')
export class BackendCategoriesController {
  constructor(
    private readonly backendCategoriesService: BackendCategoriesService,
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
  public async createCategories(
    @UploadedFile() file,
    @Body() data: IAddCategories,
  ): Promise<ResultVo<null>> {
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
  public async categoriesnList(
    @Body() data: ICategoriesList,
  ): Promise<ResultVo<{ list: Array<Categories>; total: number }>> {
    const result = new ResultVoUtil();
    try {
      const {
        list,
        total,
      } = await this.backendCategoriesService.getCagegoriesList(data);
      return result.success({
        total,
        list,
      });
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 获取使用中的商品标签
   * @param data
   */
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.PROXY)
  @Get('/get-using-categories')
  public async categoriesUseList(): Promise<
    ResultVo<{
      list: Array<Categories>;
    }>
  > {
    const result = new ResultVoUtil();
    try {
      const list = await this.backendCategoriesService.getAllCagetories(true);
      return result.success<{
        list: Array<Categories>;
      }>({
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
  public async updateCategories(
    @Body() params: IUpdateCategories,
  ): Promise<ResultVo<null>> {
    const result = new ResultVoUtil();
    try {
      await this.backendCategoriesService.updateCategories(params);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }
}
