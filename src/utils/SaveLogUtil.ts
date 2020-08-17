/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 18:15:41
 * @LastEditTime: 2020-08-13 18:14:55
 * @FilePath: /koala-server/src/utils/SaveLogUtil.ts
 */

import { sysErr } from 'src/config/LogConfig';

export class SaveLogUtil {
  private readonly logStr: string = '';
  constructor(private readonly logParams: { [key: string]: string | number }) {
    this.logStr = this.objectTransferStr();
  }

  saveError() {
    sysErr.error(`\n ${this.logStr}\n `);
  }

  private objectTransferStr() {
    return Object.keys(this.logParams).reduce(
      (prev: string, current: string) =>
        `${prev} \n ${current} = ${this.logParams[current]}`,
      '',
    );
  }
}
