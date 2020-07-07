/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-07 18:41:59
 * @LastEditTime: 2020-07-07 19:04:14
 * @FilePath: /koala-server/src/global/enums/EFilePath.ts
 */

// 运行主目录
const cwd = `${process.cwd()}`;

// 上传主目录
export const HOME = `${cwd}/upload`;

// 图片资源目录
export const IMAGE = `${HOME}/images`;

export default [HOME, IMAGE];
