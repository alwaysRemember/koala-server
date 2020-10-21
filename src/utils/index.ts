/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-18 15:04:19
 * @LastEditTime: 2020-10-21 14:35:44
 * @FilePath: /koala-server/src/utils/index.ts
 */
import * as xml2js from 'xml2js';
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
export const transferXmlToJson = (data: string): Promise<any> => {
  return new Promise((res, rej) => {
    const parser = new xml2js.Parser({
      trim: true,
      explicitArray: false,
      explicitRoot: false,
    });
    parser.parseString(data, (err, result) => {
      if (err) rej(err);
      res(result);
    });
  });
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
