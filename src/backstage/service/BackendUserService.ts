/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:49:30
 * @LastEditTime: 2020-07-20 17:46:17
 * @FilePath: /koala-server/src/backstage/service/BackendUserService.ts
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

  backendFindByUserId(userId: number): Promise<BackendUser>;
}
