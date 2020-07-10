/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-09 17:36:58
 * @LastEditTime: 2020-07-09 18:11:39
 * @FilePath: /koala-server/src/backstage/service/BackendAppletUsersService.ts
 */

import { IBackendAppletUsersListRequestParams } from '../form/BackendAppletUsersForm';
import { IFrontUser } from 'src/global/form/User';

export interface BackendAppletUsersService {
  getAppletUserAllList(): Promise<Array<IFrontUser>>;
  getAppletUserList(
    params: IBackendAppletUsersListRequestParams,
  ): Promise<Array<IFrontUser>>;
}
