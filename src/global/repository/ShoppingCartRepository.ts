import { EntityRepository, Repository } from 'typeorm';
import { ShoppingCart } from '../dataobject/ShoppingCart.entity';

/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-27 14:59:30
 * @LastEditTime: 2020-11-27 15:00:00
 * @FilePath: /koala-server/src/global/repository/ShoppingCartRepository.ts
 */
@EntityRepository(ShoppingCart)
export class ShoppingCartRepository extends Repository<ShoppingCart> {}
