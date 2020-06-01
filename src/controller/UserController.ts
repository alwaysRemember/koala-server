/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 17:01:56
 * @LastEditTime: 2020-05-28 18:54:21
 * @FilePath: /koala_background_server/src/controller/UserController.ts
 */
import { Controller, Body, Res, Get } from '@nestjs/common';
import log4js, { sysInfo } from 'src/config/LogConfig';

@Controller('/user')
export class UserController {
  @Get('/test')
  public test(@Res() res, @Body() body) {
    res.json('123');
  }
}
