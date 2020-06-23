/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-22 17:33:22
 * @LastEditTime: 2020-06-22 17:38:55
 * @FilePath: /koala-background-server/src/frontend/modules/FrontControllerModule.ts
 */

import { Module } from '@nestjs/common';
import { LoginModule } from './FrontUserModule';

const list = [LoginModule];

@Module({
  imports: list,
  exports: list,
})
export class FrontControllerModule {}
