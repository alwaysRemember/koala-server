/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-07 18:28:17
 * @LastEditTime: 2020-07-07 18:32:09
 * @FilePath: /koala-server/typings.d.ts
 */

declare interface File extends Blob {
  originalname: any;
  readonly lastModified: number;
  readonly name: string;
  buffer: ArrayBuffer;
}
