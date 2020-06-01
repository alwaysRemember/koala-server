/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 18:45:06
 * @LastEditTime: 2020-05-28 19:09:15
 * @FilePath: /koala_background_server/src/middleware/AuthMiddleware.ts
 */
import { NestMiddleware, Injectable, HttpStatus } from '@nestjs/common';
import { ResultVo } from 'src/viewobject/ResultVo';
import { ResultVoStatus } from 'src/enums/ResultVoStatus';

/**
 * 后台登录校验
 */
@Injectable()
export class BackgroundLoginMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    next();
  }
}
