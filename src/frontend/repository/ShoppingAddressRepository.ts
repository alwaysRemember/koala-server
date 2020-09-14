/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-14 15:29:55
 * @LastEditTime: 2020-09-14 15:30:33
 * @FilePath: /koala-server/src/frontend/repository/ShoppingAddressRepository.ts
 */

import { EntityRepository, Repository } from 'typeorm';
import { ShoppingAddress } from '../dataobject/ShoppingAddress.entity';

@EntityRepository(ShoppingAddress)
export class ShoppingAddressRepository extends Repository<ShoppingAddress> {}
