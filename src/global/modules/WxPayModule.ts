/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-18 17:05:41
 * @LastEditTime: 2020-09-18 17:06:51
 * @FilePath: /koala-server/src/global/modules/wxPayModule.ts
 */

import { Module } from '@nestjs/common';
import { WxPayController } from '../controller/wxPayController';

@Module({
  controllers: [WxPayController],
})
export class wxPayModule {}
