/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-02 11:16:16
 * @LastEditTime: 2020-06-15 15:42:18
 * @FilePath: /koala-background-server/src/form/BackendUserForm.ts
 */
import {
  EBackendUserType,
  EbackendFindWithUserType,
} from 'src/enums/EBackendUserType';

// 登录参数
export class BackendUserLoginForm {
  public username: string;
  public password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

// 后台管理员参数
export class BackendUserForm extends BackendUserLoginForm {
  public userType: EBackendUserType;
  constructor(username: string, password: string, userType: EBackendUserType) {
    super(username, password);
    this.password = password;
    this.userType = userType;
    this.username = username;
  }
}

// 修改管理员密码参数
export class BackendUserChangePasswordForm {
  public username: string;
  public oldPassword: string;
  public newPassword: string;
}

// 管理员列表
export class BackendUserListForm {
  public username: string;
  public userType: EbackendFindWithUserType;
  public page: number;
  public number: number;
}
