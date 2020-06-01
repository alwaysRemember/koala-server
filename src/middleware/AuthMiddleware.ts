/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 18:45:06
 * @LastEditTime: 2020-06-01 19:07:44
 * @FilePath: /koala-background-server/src/middleware/AuthMiddleware.ts
 */
import { NestMiddleware, Injectable, HttpStatus } from '@nestjs/common';

/**
 * 后台登录校验
 */
@Injectable()
export class BackgroundLoginMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    next();
  }
}
