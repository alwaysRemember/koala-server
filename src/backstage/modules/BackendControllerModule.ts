/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 11:32:23
 * @LastEditTime: 2020-07-08 18:55:14
 * @FilePath: /koala-server/src/backstage/modules/BackendControllerModule.ts
 */
import { Module } from '@nestjs/common';
import { BackendUserModule } from './BackendUserModule';
import { BackendCategoriesModule } from './BackendCategoriesModule';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from '../guards/PermissionsGuard';
import { RedisCacheServiceImpl } from '../service/impl/RedisCacheServiceImpl';

const list = [BackendUserModule, BackendCategoriesModule];

@Module({
  imports: list,
  exports: list,
  providers: [
    RedisCacheServiceImpl,
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class BackendControllerModule {}
