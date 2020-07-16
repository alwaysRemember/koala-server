/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-07 18:41:59
 * @LastEditTime: 2020-07-16 12:19:39
 * @FilePath: /koala-server/src/global/enums/EFilePath.ts
 */

// 运行主目录
const cwd = `${process.cwd()}`;

// 上传主目录
export const HOME = `${cwd}/upload`;

// 图片路径
export const IMAGE = `${HOME}/image`;

// 视频路径
export const VIDEO = `${HOME}/video`;

// 音频路径
export const AUDIO = `${HOME}/audio`;

export default [HOME, IMAGE, VIDEO, AUDIO];
