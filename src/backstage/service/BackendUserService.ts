/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:49:30
 * @LastEditTime: 2020-06-18 17:37:01
 * @FilePath: /koala-background-server/src/service/BackendUserService.ts
 */
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import {
  IBackendUserForm,
  IBackendUserLoginForm,
  IBackendUserChangePasswordForm,
  IBackendUserListForm,
} from 'src/backstage/form/BackendUserForm';

export interface BackendUserService {
  backendLogin(user: IBackendUserLoginForm): Promise<BackendUser>;

  backendChangePassword(user: IBackendUserChangePasswordForm): void;

  backendAddUser(user: IBackendUserForm);

  backendFindUserListWithParams(
    params: IBackendUserListForm,
  ): Promise<Array<BackendUser>>;

  backendFindUserList(): Promise<Array<BackendUser>>;

  backendUpdateAdminUser(user: BackendUser): void;

  backendDeleteAdminUser(userId: number): void;
}
