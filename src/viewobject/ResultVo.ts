/*
 * @Author: Always
 * @LastEditors  : Always
 * @email: 740905172@qq.com
 * @Date: 2019-12-18 17:44:19
 * @LastEditTime : 2019-12-18 17:44:36
 * @FilePath: /node-server/src/viewobject/ResultVo.ts
 */

export class ResultVo<T> {
  /**
   * 返回类参数
   * @param code 自定义状态码
   * @param data 数据
   * @param message  提示
   */
  constructor(private code: number, private data: T, private message: string) {}
}
