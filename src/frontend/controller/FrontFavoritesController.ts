/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:28:50
 * @LastEditTime: 2020-11-11 14:45:20
 * @FilePath: /koala-server/src/frontend/controller/FrontFavoritesController.ts
 */

import { Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { GetFavoritesDataSchema } from '../schema/FrontFavoritesSchema';
import { FavoritesService } from '../service/FavoritesService';

@Controller('/front/favorites')
export class FrontFavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(GetFavoritesDataSchema, ({ type }) => type === 'body'),
  )
  @Post('/get-favorites-data')
  public async getFavoritesData() {
    const result = new ResultVoUtil();
    try {
    } catch (e) {
      return result.error(e.message);
    }
  }
}
