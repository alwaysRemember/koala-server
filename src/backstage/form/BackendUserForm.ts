/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-02 11:16:16
 * @LastEditTime: 2020-08-06 12:18:24
 * @FilePath: /koala-server/src/backstage/form/BackendUserForm.ts
 */
import {
  EBackendUserType,
  EbackendFindWithUserType,
} from 'src/backstage/enums/EBackendUserType';

// 登录参数

export interface IBackendUserLoginForm {
  username: string;
  password: string;
}

// 后台管理员参数
export interface IBackendUserForm extends IBackendUserLoginForm {
  userType: EBackendUserType;
  email: string;
  appletUserId: number;
}

// 修改管理员密码参数
export interface IBackendUserChangePasswordForm {
  username: string;
  oldPassword: string;
  newPassword: string;
}

// 管理员列表
export interface IBackendUserListForm {
  username: string;
  userType: EbackendFindWithUserType;
  page: number;
  number: number;
}
