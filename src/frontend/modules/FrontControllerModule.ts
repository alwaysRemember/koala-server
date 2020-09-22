/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-22 17:33:22
 * @LastEditTime: 2020-09-22 16:33:32
 * @FilePath: /koala-server/src/frontend/modules/FrontControllerModule.ts
 */

import { Module } from '@nestjs/common';
import { FrontUserModule } from './FrontUserModule';
import { FrontHomeModule } from './FrontHomeModule';
import { FrontProductModule } from './FrontProductModule';
import { FrontShoppingAddressModule } from './FrontShoppingAddressModule';
import { FrontOrderModule } from './FrontOrderMOdule';

const list = [
  FrontUserModule,
  FrontHomeModule,
  FrontProductModule,
  FrontShoppingAddressModule,
  FrontOrderModule
];

@Module({
  imports: list,
  exports: list,
})
export class FrontControllerModule {}
