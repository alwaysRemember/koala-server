/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-07 18:28:17
 * @LastEditTime: 2020-07-15 18:40:45
 * @FilePath: /koala-server/typings.d.ts
 */

declare interface File extends Blob {
  originalname: any;
  readonly lastModified: number;
  readonly name: string;
  readonly mimetype: string;
  buffer: ArrayBuffer;
}
