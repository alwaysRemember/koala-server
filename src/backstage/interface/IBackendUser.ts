import { BackendUser } from '../dataobject/BackendUser.entity';
/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-06 17:01:36
 * @LastEditTime: 2020-09-17 15:48:01
 * @FilePath: /koala-server/src/backstage/interface/IBackendUser.ts
 */

import { EBackendUserType } from '../enums/EBackendUserType';
import { IDefaultListResponse } from './IGlobal';

export interface IBindAppletUser {
  userId: number;
  appletUserId: number;
}

export interface ILoginResponse {
  username: string;
  userType: EBackendUserType;
  token: string;
}

export interface IBackendFindUserListResposne
  extends IDefaultListResponse<BackendUser> {}
