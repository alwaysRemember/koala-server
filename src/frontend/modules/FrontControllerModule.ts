/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-22 17:33:22
 * @LastEditTime: 2020-12-07 18:54:06
 * @FilePath: /koala-server/src/frontend/modules/FrontControllerModule.ts
 */

import { Module } from '@nestjs/common';
import { FrontUserModule } from './FrontUserModule';
import { FrontHomeModule } from './FrontHomeModule';
import { FrontProductModule } from './FrontProductModule';
import { FrontShoppingAddressModule } from './FrontShoppingAddressModule';
import { FrontOrderModule } from './FrontOrderModule';
import { FrontFavoritesModule } from './FrontFavoritesModule';
import { FrontCategoriesModule } from './FrontCategoriesModule';
import { FrontShoppingCartModule } from './FrontShoppingCartModule';

const list = [
  FrontUserModule,
  FrontHomeModule,
  FrontProductModule,
  FrontShoppingAddressModule,
  FrontOrderModule,
  FrontFavoritesModule,
  FrontCategoriesModule,
  FrontShoppingCartModule,
];

@Module({
  imports: list,
  exports: list,
})
export class FrontControllerModule {}
