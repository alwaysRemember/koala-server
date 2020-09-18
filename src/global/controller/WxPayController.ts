/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-18 17:03:30
 * @LastEditTime: 2020-09-18 17:08:32
 * @FilePath: /koala-server/src/global/controller/wxPayController.ts
 */

import { Body, Controller, Get } from '@nestjs/common';

@Controller('/wxPay')
export class WxPayController {
  @Get('/pay-notify')
  public async payNotify(@Body() data) {
    console.log(data);
  }
}
