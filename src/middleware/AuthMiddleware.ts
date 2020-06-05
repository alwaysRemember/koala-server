/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 18:45:06
 * @LastEditTime: 2020-06-05 17:20:48
 * @FilePath: /koala-background-server/src/middleware/AuthMiddleware.ts
 */
import { NestMiddleware, Injectable, HttpStatus, Module } from '@nestjs/common';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { Request, Response } from 'express';
import { ResultVo } from 'src/viewobject/ResultVo';
import { RedisCacheServiceImpl } from 'src/service/impl/RedisCacheServiceImpl';
import { RedisClientModule } from 'src/modules/RedisClientModule';

/**
 * 后台登录校验
 */
@Injectable()
export class BackgroundLoginMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisCacheServiceImpl) {}
  async use(req: Request, res: Response, next: () => void) {
    const token: string = req.headers['token'] as string;
    // 判断token是否存在
    if (!token) {
      res.status(HttpStatus.OK).json(new ResultVoUtil().noLogin());
      return;
    }

    // 从redis获取token信息
    const dataStr = await this.redisService.get(token);
    if (!dataStr) {
      res.status(HttpStatus.OK).json(new ResultVoUtil().noLogin());
      return ;
    }
    next();
  }
}
