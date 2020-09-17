/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-17 15:46:32
 * @LastEditTime: 2020-09-17 15:47:01
 * @FilePath: /koala-server/src/backstage/interface/IGlobal.ts
 */
export interface IDefaultListResponse<T> {
  total: number;
  list: Array<T>;
}
