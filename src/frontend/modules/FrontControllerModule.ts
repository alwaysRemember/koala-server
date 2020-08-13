/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-22 17:33:22
 * @LastEditTime: 2020-08-13 15:14:10
 * @FilePath: /koala-server/src/frontend/modules/FrontControllerModule.ts
 */

import { Module } from '@nestjs/common';
import { FrontUserModule } from './FrontUserModule';
import { FrontHomeModule } from './FrontHomeModule';

const list = [FrontUserModule, FrontHomeModule];

@Module({
  imports: list,
  exports: list,
})
export class FrontControllerModule {}
