/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-09 11:04:28
 * @LastEditTime: 2020-07-09 11:24:03
 * @FilePath: /koala-server/src/backstage/utils/index.ts
 */
import { EBackendUserType } from '../enums/EBackendUserType';
import { SetMetadata } from '@nestjs/common';

/**
 * 设置路由权限
 * @param permissions
 */
export const SetPermissionsForController = (permissions: EBackendUserType) =>
  SetMetadata('permissions', permissions);
