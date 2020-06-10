/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:49:30
 * @LastEditTime: 2020-06-10 13:54:27
 * @FilePath: /koala-background-server/src/service/BackendUserService.ts
 */
import { BackendUserLoginForm } from 'src/form/BackendUserLoginForm';
import { BackendUser } from 'src/dataobject/BackendUser.entity';
import { BackendUserChangePassword } from 'src/form/BackendUserChangePassword';

export interface BackendUserService {
  backendLogin(user: BackendUserLoginForm): Promise<BackendUser>;

  backendChangePassword(user: BackendUserChangePassword): void;
}
