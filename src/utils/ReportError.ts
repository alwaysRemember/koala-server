/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-06 12:13:05
 * @LastEditTime: 2020-09-22 19:47:36
 * @FilePath: /koala-server/src/utils/ReportError.ts
 */

export const reportErr = (message: string, e: any = {}): Promise<any> =>
  Promise.reject({
    message,
    e: JSON.stringify(e) === '{}' ? e.message : JSON.stringify(e),
  });
