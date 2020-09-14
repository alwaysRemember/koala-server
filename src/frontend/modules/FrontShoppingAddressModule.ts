/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-14 15:21:05
 * @LastEditTime: 2020-09-14 16:59:09
 * @FilePath: /koala-server/src/frontend/modules/FrontShoppingAddressModule.ts
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { FrontShoppingAddressController } from '../controller/FrontShoppingAddressController';
import { ShoppingAddress } from '../dataobject/ShoppingAddress.entity';
import { ShoppingAddressRepository } from '../repository/ShoppingAddressRepository';
import { ShoppingAddressService } from '../service/ShoppingAddressService';
@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingAddress, ShoppingAddressRepository]),
    TypeOrmModule.forFeature([FrontUser, FrontUserRepository]),
  ],
  controllers: [FrontShoppingAddressController],
  providers: [ShoppingAddressService],
})
export class FrontShoppingAddressModule {}
