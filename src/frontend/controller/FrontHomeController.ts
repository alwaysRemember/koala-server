/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-13 14:43:14
 * @LastEditTime: 2020-08-13 15:14:46
 * @FilePath: /koala-server/src/frontend/controller/FrontHomeController.ts
 */

import { Controller, HttpCode, Post, Get } from '@nestjs/common';
import { HomeService } from '../service/HomeService';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';

@Controller('/front/home')
export class FrontHomeController {
  constructor(private readonly homeService: HomeService) {}

  @HttpCode(200)
  @Get('/get-home-data')
  public async getHomeData() {
    const result = new ResultVoUtil();
    try {
      const data = await this.homeService.getHomeData();
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
