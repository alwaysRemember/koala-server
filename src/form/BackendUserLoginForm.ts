/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:31:32
 * @LastEditTime: 2020-06-10 15:00:31
 * @FilePath: /koala-background-server/src/form/BackendUserLoginForm.ts
 */

export class BackendUserLoginForm {
  public username: string;
  public password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
