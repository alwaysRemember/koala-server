/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-22 17:33:22
 * @LastEditTime: 2020-11-11 14:32:40
 * @FilePath: /koala-server/src/frontend/modules/FrontControllerModule.ts
 */

import { Module } from '@nestjs/common';
import { FrontUserModule } from './FrontUserModule';
import { FrontHomeModule } from './FrontHomeModule';
import { FrontProductModule } from './FrontProductModule';
import { FrontShoppingAddressModule } from './FrontShoppingAddressModule';
import { FrontOrderModule } from './FrontOrderMOdule';
import { FrontFavoritesModule } from './FrontFavoritesModule';

const list = [
  FrontUserModule,
  FrontHomeModule,
  FrontProductModule,
  FrontShoppingAddressModule,
  FrontOrderModule,
  FrontFavoritesModule
];

@Module({
  imports: list,
  exports: list,
})
export class FrontControllerModule {}
