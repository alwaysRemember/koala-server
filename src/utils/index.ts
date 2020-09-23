/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-18 15:04:19
 * @LastEditTime: 2020-09-23 15:09:00
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

/**
 * 在xml中获取json数据
 * @param data
 * @param value
 */
export const transferXmlToJson = (data: string, value): string => {
  const f = data.toString().split(`<${value}>`);
  const s = f[1].split(`</${value}>`);

  return s[0].indexOf('CDATA') > -1 ? /[^CDATA\[]\w+/.exec(s[0])[0] : s[0];
};

/**
 * json转为xml
 * @param data
 */
export const tansferJsonToXml = (data: Object): string => {
  let str = '<xml>';
  for (let key in data) {
    str += `<${key}>${data[key]}</${key}>`;
  }
  str += '</xml>';
  return str;
};
