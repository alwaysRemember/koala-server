/*
 * @Author: Always
 * @LastEditors: Always
 * @email: 740905172@qq.com
 * @Date: 2019-12-18 17:52:18
 * @LastEditTime: 2020-06-16 18:33:59
 * @FilePath: /koala-background-server/src/utils/ResultVoUtil.ts
 */

import { ResultVo } from 'src/viewobject/ResultVo';
import { EResultVoStatus } from 'src/enums/EResultVoStatus';

/**
 * 返回类包装
 */
export class ResultVoUtil {
  /**
   * 成功
   * @param data 数据
   */
  success<T>(data: any = null): ResultVo<T> {
    return new ResultVo<T>(EResultVoStatus.OK, data, '成功');
  }

  /**
   * 失败
   */
  public error(message: string = '数据错误'): ResultVo<any> {
    return new ResultVo(EResultVoStatus.TOAST, null, message);
  }

  /**
   * 登录警告
   */
  noLogin(): ResultVo<any> {
    return new ResultVo(EResultVoStatus.NO_LOGIN, null, '未登录');
  }
}
