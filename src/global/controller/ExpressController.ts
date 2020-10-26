/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-10-26 14:28:52
 * @LastEditTime: 2020-10-26 15:10:53
 * @FilePath: /koala-server/src/global/controller/ExpressController.ts
 */

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ExpressService } from '../service/ExpressService';

@Controller('/express')
export class ExpressController {
  constructor(private readonly expressService: ExpressService) {}

  @HttpCode(200)
  @Post('/notify')
  public async expressNotify(@Body() { param }) {
    try {
      await this.expressService.expressNotify(JSON.parse(param));
      return {
        result: true,
        returnCode: '200',
        message: '成功',
      };
    } catch (e) {
      return {
        result: false,
        returnCode: '500',
        message: '服务器出错',
      };
    }
  }
}
