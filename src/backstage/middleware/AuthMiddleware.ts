/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 18:45:06
 * @LastEditTime: 2020-07-22 11:30:52
 * @FilePath: /koala-server/src/backstage/middleware/AuthMiddleware.ts
 */
import { NestMiddleware, Injectable, HttpStatus } from '@nestjs/common';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { Request, Response } from 'express';
import { BackendUserRepository } from 'src/backstage/repository/BackendUserRepository';
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { ETokenEnums } from '../enums/TokenEnums';
import { RedisCacheService } from '../service/RedisCacheService';

/**
 * 后台登录校验
 */
@Injectable()
export class BackgroundLoginMiddleware implements NestMiddleware {
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly backendUserRepository: BackendUserRepository,
  ) {}
  async use(req: Request, res: Response, next: () => void) {
    const token: string = req.headers['token'] as string;
    // 判断token是否存在
    if (!token) {
      res.status(HttpStatus.OK).json(new ResultVoUtil().noLogin());
      return;
    }

    // 从redis获取token信息
    const dataStr = await this.redisService.get(token);

    if (dataStr) {
      const { userId, username, userType, password }: BackendUser = JSON.parse(
        dataStr,
      );
      const user: BackendUser = await this.backendUserRepository.findOne(
        userId,
      );
      // 判断数据是否和token中的数据吻合，如果不吻合则代表数据有更新，删除token并且重新登录
      // else  重置登录态过期时间
      if (
        !(
          userId === user.userId &&
          username === user.username &&
          userType === user.userType &&
          password === user.password
        )
      ) {
        await this.redisService.delete(token);
        res.status(HttpStatus.OK).json(new ResultVoUtil().noLogin());
        return;
      } else {
        await this.redisService.set(
          token,
          dataStr,
          ETokenEnums.TOKEN_EXPIRATION_TIME,
        );
      }
    } else {
      res.status(HttpStatus.OK).json(new ResultVoUtil().noLogin());
      return;
    }
    next();
  }
}
