/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-02 11:16:16
 * @LastEditTime: 2020-06-10 15:01:33
 * @FilePath: /koala-background-server/src/form/BackendUserForm.ts
 */
import { EBackendUserType } from 'src/enums/EBackendUserType';
import { BackendUserLoginForm } from './BackendUserLoginForm';

/**
 * 后台管理员参数
 */
export class BackendUserForm extends BackendUserLoginForm {
  public user_type: EBackendUserType;
  constructor(username: string, password: string, user_type: EBackendUserType) {
    super(username, password);
    this.password = password;
    this.user_type = user_type;
    this.username = username;
  }
}
