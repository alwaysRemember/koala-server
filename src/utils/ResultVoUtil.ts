/*
 * @Author: Always
 * @LastEditors: Always
 * @email: 740905172@qq.com
 * @Date: 2019-12-18 17:52:18
 * @LastEditTime: 2020-06-01 19:07:36
 * @FilePath: /koala-background-server/src/utils/ResultVoUtil.ts
 */

import { ResultVo } from 'src/viewobject/ResultVo';
import { HttpStatus } from '@nestjs/common';
import { EResultVoStatus } from 'src/enums/EResultVoStatus';

/**
 * 返回类包装
 */
export class ResultVoUtil {
  constructor(private readonly res: any) {}

  /**
   * 成功
   * @param data 数据
   */
  success<T>(data: any = null): void {
    this.res
      .status(HttpStatus.OK)
      .json(new ResultVo<T>(EResultVoStatus.OK, data, '成功'));
  }

  /**
   * 成功
   */
  error(message: string = '数据错误'): void {
    this.res
      .status(HttpStatus.OK)
      .json(new ResultVo(EResultVoStatus.OK, message, '失败'));
  }
}
