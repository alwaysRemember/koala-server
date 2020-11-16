/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-16 18:02:59
 * @LastEditTime: 2020-11-16 18:45:38
 * @FilePath: /koala-server/src/frontend/service/CategoriesService.ts
 */

import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from 'src/global/repository/CategoriesRepository';
import { reportErr } from 'src/utils/ReportError';
import { FrontException } from '../exception/FrontException';
import { TCategoriesResponseData } from '../interface/IFrontCategories';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  /**
   * 获取分类列表
   */
  async getCategoriesList(): Promise<TCategoriesResponseData> {
    try {
      try {
        const data = await this.categoriesRepository.find({
          select: ['id', 'categoriesName', 'categoriesIconUrl'],
          where: { isUse: true },
        });
        return data.map(({ id, categoriesName, categoriesIconUrl }) => ({
          id,
          name: categoriesName,
          imgPath: categoriesIconUrl,
        }));
      } catch (e) {
        await reportErr('获取分类信息失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }
}
