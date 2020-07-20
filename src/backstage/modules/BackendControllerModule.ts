/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 11:32:23
 * @LastEditTime: 2020-07-20 17:04:33
 * @FilePath: /koala-server/src/backstage/modules/BackendControllerModule.ts
 */
import { Module } from '@nestjs/common';
import { BackendUserModule } from './BackendUserModule';
import { BackendCategoriesModule } from './BackendCategoriesModule';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from '../guards/PermissionsGuard';
import { RedisCacheServiceImpl } from '../service/impl/RedisCacheServiceImpl';
import { BackendAppletUsersModule } from './BackendAppletUsersModule';
import { BackendMediaLibraryModule } from './BackendMediaLibraryModule';
import { BackendProductDetailModule } from './BackendProductDetailModule';

const list = [
  BackendUserModule,
  BackendCategoriesModule,
  BackendAppletUsersModule,
  BackendMediaLibraryModule,
  BackendProductDetailModule,
];

@Module({
  imports: list,
  exports: list,
  providers: [
    RedisCacheServiceImpl,
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class BackendControllerModule {}
