/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-02 11:16:16
 * @LastEditTime: 2020-06-04 15:32:07
 * @FilePath: /koala-background-server/src/form/BackendUserForm.ts
 */
import { EBackendUserType } from 'src/enums/EBackendUserType';
import { BackendUserLoginForm } from './BackendUserLoginForm';

/**
 * 后台管理员参数
 */
export class BackendUserForm extends BackendUserLoginForm {
  public user_type: EBackendUserType;
}
