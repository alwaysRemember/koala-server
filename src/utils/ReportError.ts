/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-06 12:13:05
 * @LastEditTime: 2020-08-06 17:08:09
 * @FilePath: /koala-server/src/utils/ReportError.ts
 */

export const reportErr = (message: string, e: object = {}): Promise<any> =>
  Promise.reject({
    message,
    e: JSON.stringify(e),
  });
