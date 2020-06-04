/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:49:30
 * @LastEditTime: 2020-06-04 15:52:07
 * @FilePath: /koala-background-server/src/service/BackendUserService.ts
 */
import { BackendUserLoginForm } from 'src/form/BackendUserLoginForm';
import { BackendUser } from 'src/dataobject/BackendUser.entity';

export interface BackendUserService {
  backendLogin(user: BackendUserLoginForm): Promise<BackendUser>;
}
