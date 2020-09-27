/*
 * 路由访问权限校验
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-08 18:43:11
 * @LastEditTime: 2020-09-27 18:17:15
 * @FilePath: /koala-server/src/backstage/guards/PermissionsGuard.ts
 */
import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { EBackendUserType } from '../enums/EBackendUserType';
import { BackendUser } from '../dataobject/BackendUser.entity';
import { BackendException } from '../exception/backendException';
import { RedisCacheService } from '../service/RedisCacheService';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly redisService: RedisCacheService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取路由权限
    const permissions = this.reflector.get<EBackendUserType>(
      'permissions',
      context.getHandler(),
    );

    // 判断是否存在权限
    if (!permissions) {
      return true;
    }

    // 获取用户信息
    const userStr = await this.redisService.get(
      context.switchToHttp().getRequest().headers.token,
    );

    if (userStr) {
      const user: BackendUser = JSON.parse(userStr);
      // 校验用户权限
      if (user.userType >= permissions) {
        return true;
      } else {
        throw new BackendException('当前用户权限不足，请更换用户访问');
      }
    }

    return true;
  }
}
