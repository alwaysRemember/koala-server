/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:49:30
 * @LastEditTime: 2020-06-15 16:10:19
 * @FilePath: /koala-background-server/src/service/BackendUserService.ts
 */
import { BackendUser } from 'src/dataobject/BackendUser.entity';
import {
  BackendUserForm,
  BackendUserLoginForm,
  BackendUserChangePasswordForm,
  BackendUserListForm,
} from 'src/form/BackendUserForm';

export interface BackendUserService {
  backendLogin(user: BackendUserLoginForm): Promise<BackendUser>;

  backendChangePassword(user: BackendUserChangePasswordForm): void;

  backendAddUser(user: BackendUserForm);

  backendFindUserListWithParams(
    params: BackendUserListForm,
  ): Promise<Array<BackendUser>>;

  backendFindUserList(): Promise<Array<BackendUser>>;
}
