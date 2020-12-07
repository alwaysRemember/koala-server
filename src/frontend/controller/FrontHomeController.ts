/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-13 14:43:14
 * @LastEditTime: 2020-12-07 14:25:02
 * @FilePath: /koala-server/src/frontend/controller/FrontHomeController.ts
 */

import { Controller, HttpCode, Post, Get, Req } from '@nestjs/common';
import { HomeService } from '../service/HomeService';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { IHomeData } from '../interface/IFrontHome';
import { ResultVo } from 'src/global/viewobject/ResultVo';

@Controller('/front/home')
export class FrontHomeController {
  constructor(private readonly homeService: HomeService) {}

  @HttpCode(200)
  @Get('/get-home-data')
  public async getHomeData(@Req() {headers:{openid}}):Promise<ResultVo<IHomeData>> {
    const result = new ResultVoUtil();
    try {
      const data = await this.homeService.getHomeData(openid);
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
