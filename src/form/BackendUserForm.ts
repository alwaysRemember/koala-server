/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-02 11:16:16
 * @LastEditTime: 2020-06-18 16:14:48
 * @FilePath: /koala-background-server/src/form/BackendUserForm.ts
 */
import {
  EBackendUserType,
  EbackendFindWithUserType,
} from 'src/enums/EBackendUserType';

// 登录参数

export interface IBackendUserLoginForm {
  username: string;
  password: string;
}

// 后台管理员参数
export interface IBackendUserForm extends IBackendUserLoginForm {
  userType: EBackendUserType;
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
