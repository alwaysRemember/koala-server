/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-22 17:33:22
 * @LastEditTime: 2020-07-01 18:50:26
 * @FilePath: /koala-background-server/src/frontend/modules/FrontControllerModule.ts
 */

import { Module } from '@nestjs/common';
import { FrontUserModule } from './FrontUserModule';

const list = [FrontUserModule];

@Module({
  imports: list,
  exports: list,
})
export class FrontControllerModule {}
