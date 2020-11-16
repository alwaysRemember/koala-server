/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-16 18:00:28
 * @LastEditTime: 2020-11-16 18:45:47
 * @FilePath: /koala-server/src/frontend/controller/FrontCategoritesController.ts
 */

import { Controller, Get, HttpCode } from '@nestjs/common';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { CategoriesService } from '../service/CategoriesService';

@Controller('/front/categories')
export class FrontCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * 获取分类列表
   */
  @HttpCode(200)
  @Get('/get-categories-list')
  public async getCategoriesList() {
    const result = new ResultVoUtil();

    try {
      const data = await this.categoriesService.getCategoriesList();
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
