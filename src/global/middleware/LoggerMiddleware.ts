/*
 * 日志中间件
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 17:59:13
 * @LastEditTime: 2020-11-12 15:59:31
 * @FilePath: /koala-server/src/global/middleware/LoggerMiddleware.ts
 */
import { NestMiddleware, Injectable } from '@nestjs/common';
import log4js, { category, level } from '../../config/LogConfig';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    category.forEach(item => {
      level.forEach(type => {
        let log = `${item}${type}`;
        res[log] = log4js.getLogger(log);
      });
    });
    next();
  }
}
