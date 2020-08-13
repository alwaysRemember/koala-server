/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-05 16:06:45
 * @LastEditTime: 2020-08-13 14:51:05
 * @FilePath: /koala-server/src/frontend/middleware/FrontAuthMiddleware.ts
 */

import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';

@Injectable()
export class FrontAuthMiddleware implements NestMiddleware {
  constructor() {}
  async use(req: Request, res: Response, next: () => void) {
    const openid: string = req.headers['openid'] as string;
    // 判断openid是否存在
    if (!openid) {
      res.status(HttpStatus.OK).json(new ResultVoUtil().noLogin());
      return;
    }
    next();
  }
}
