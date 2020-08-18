/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-18 15:04:19
 * @LastEditTime: 2020-08-18 15:08:24
 * @FilePath: /koala-server/src/utils/index.ts
 */

/**
 * 数组拍平
 * @param list
 */
export const arrayFlat = <T>(list: Array<Array<T>>): Array<T> =>
  list.reduce(
    (prev, value) => [
      ...prev,
      ...(Array.isArray(value) ? [...value] : [value]),
    ],
    [],
  );
