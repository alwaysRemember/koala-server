/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:49:30
 * @LastEditTime: 2020-06-18 16:15:03
 * @FilePath: /koala-background-server/src/service/BackendUserService.ts
 */
import { BackendUser } from 'src/dataobject/BackendUser.entity';
import {
  IBackendUserForm,
  IBackendUserLoginForm,
  IBackendUserChangePasswordForm,
  IBackendUserListForm,
} from 'src/form/BackendUserForm';

export interface BackendUserService {
  backendLogin(user: IBackendUserLoginForm): Promise<BackendUser>;

  backendChangePassword(user: IBackendUserChangePasswordForm): void;

  backendAddUser(user: IBackendUserForm);

  backendFindUserListWithParams(
    params: IBackendUserListForm,
  ): Promise<Array<BackendUser>>;

  backendFindUserList(): Promise<Array<BackendUser>>;

  backendUpdateAdminUser(user: BackendUser): void;
}
