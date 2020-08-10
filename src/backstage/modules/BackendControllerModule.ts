/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 11:32:23
 * @LastEditTime: 2020-08-10 14:06:42
 * @FilePath: /koala-server/src/backstage/modules/BackendControllerModule.ts
 */
import { Module } from '@nestjs/common';
import { BackendUserModule } from './BackendUserModule';
import { BackendCategoriesModule } from './BackendCategoriesModule';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from '../guards/PermissionsGuard';
import { BackendAppletUsersModule } from './BackendAppletUsersModule';
import { BackendMediaLibraryModule } from './BackendMediaLibraryModule';
import { BackendProductModule } from './BackendProductModule';
import { RedisCacheService } from '../service/RedisCacheService';
import { BackendAppletHomeModule } from './BackendAppletHomeModule';

const list = [
  BackendUserModule,
  BackendCategoriesModule,
  BackendAppletUsersModule,
  BackendMediaLibraryModule,
  BackendProductModule,
  BackendAppletHomeModule
];

@Module({
  imports: list,
  exports: list,
  providers: [
    RedisCacheService,
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class BackendControllerModule {}
