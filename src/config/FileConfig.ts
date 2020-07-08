/*
 * 文件资源host
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-08 16:35:06
 * @LastEditTime: 2020-07-08 17:05:51
 * @FilePath: /koala-server/src/config/FileConfig.ts
 */

export const DEV_HOST = 'http://localhost:8080';
export const PROD_HOST = '';

export const HOST =
  process.env.NODE_ENV === 'development' ? DEV_HOST : PROD_HOST;