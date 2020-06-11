/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:49:30
 * @LastEditTime: 2020-06-11 16:09:19
 * @FilePath: /koala-background-server/src/service/BackendUserService.ts
 */
import { BackendUserLoginForm } from 'src/form/BackendUserLoginForm';
import { BackendUser } from 'src/dataobject/BackendUser.entity';
import { BackendUserChangePasswordForm } from 'src/form/BackendUserChangePasswordForm';
import { BackendUserForm } from 'src/form/BackendUserForm';

export interface BackendUserService {
  backendLogin(user: BackendUserLoginForm): Promise<BackendUser>;

  backendChangePassword(user: BackendUserChangePasswordForm): void;

  backendAddUser(user: BackendUserForm);
}
