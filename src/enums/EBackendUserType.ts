/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-01 19:03:44
 * @LastEditTime: 2020-06-01 19:07:08
 * @FilePath: /koala-background-server/src/enums/BackendUserType.ts
 */

export enum EBackendUserType {
  ADMIN = 999, // 管理员
  PROXY = 100, // 代理
  PUBLIC = 0, // 普通用户   * 基本不可能存在这个权限
}
