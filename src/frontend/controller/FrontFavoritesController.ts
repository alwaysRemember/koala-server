/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:28:50
 * @LastEditTime: 2020-11-12 15:28:52
 * @FilePath: /koala-server/src/frontend/controller/FrontFavoritesController.ts
 */

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { RemoveFavorites } from '../schema/FrontFavoritesSchema';
import { FavoritesService } from '../service/FavoritesService';

@Controller('/front/favorites')
export class FrontFavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @HttpCode(200)
  @Get('/get-favorites-data')
  public async getFavoritesData(@Req() { headers: { openid } }) {
    const result = new ResultVoUtil();
    try {
      const data = await this.favoritesService.getFavoritesData(openid);

      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }

  @HttpCode(200)
  @UsePipes(new ReqParamCheck(RemoveFavorites, ({ type }) => type === 'body'))
  @Post('remove-favorites')
  public async removeFavorites(
    @Body() { favoritesId }: { favoritesId: number },
  ) {
    const result = new ResultVoUtil();
    try {
      await this.favoritesService.removeFavorites(favoritesId);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }
}
