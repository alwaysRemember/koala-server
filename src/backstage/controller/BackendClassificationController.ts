/*
 * 后台商品分类功能
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 17:35:34
 * @LastEditTime: 2020-07-01 18:22:57
 * @FilePath: /koala-background-server/src/backstage/controller/BackendClassificationController.ts
 */

import { Controller, Get } from '@nestjs/common';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';

@Controller('/backend-classed')
export class BackendClassificationController {
  @Get('/test')
  public async test() {
    return new ResultVoUtil().success('success');
  }
}
