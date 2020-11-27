/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-27 15:11:12
 * @LastEditTime: 2020-11-27 15:45:56
 * @FilePath: /koala-server/src/frontend/modules/FrontShoppingCartModule.ts
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/global/dataobject/Product.entity';
import { ShoppingCart } from 'src/global/dataobject/ShoppingCart.entity';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { ShoppingCartRepository } from 'src/global/repository/ShoppingCartRepository';
import { FrontShoppingCartController } from '../controller/FrontShoppingCartController';
import { ShoppingCartService } from '../service/ShoppingCartService';
import { FrontUserService } from '../service/UserService';
import { FrontUserModule } from './FrontUserModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingCart, ShoppingCartRepository]),
    TypeOrmModule.forFeature([Product, ProductRepository]),
    FrontUserModule,
  ],
  controllers: [FrontShoppingCartController],
  providers: [ShoppingCartService],
})
export class FrontShoppingCartModule {}
