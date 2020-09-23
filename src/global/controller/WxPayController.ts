/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-18 17:03:30
 * @LastEditTime: 2020-09-23 16:07:14
 * @FilePath: /koala-server/src/global/controller/WxPayController.ts
 */

import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';

@Controller('/wxPay')
export class WxPayController {
  @Post('/pay-notify')
  public async payNotify(@Body() data) {
    console.log(data);
  }
}
