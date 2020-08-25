/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-22 17:33:22
 * @LastEditTime: 2020-08-25 15:09:37
 * @FilePath: /koala-server/src/frontend/modules/FrontControllerModule.ts
 */

import { Module } from '@nestjs/common';
import { FrontUserModule } from './FrontUserModule';
import { FrontHomeModule } from './FrontHomeModule';
import { FrontProductModule } from './FrontProductModule';

const list = [FrontUserModule, FrontHomeModule, FrontProductModule];

@Module({
  imports: list,
  exports: list,
})
export class FrontControllerModule {}
