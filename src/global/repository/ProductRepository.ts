/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-21 15:07:59
 * @LastEditTime: 2020-07-21 15:08:25
 * @FilePath: /koala-server/src/global/repository/ProductRepository.ts
 */
import { Repository, EntityRepository } from 'typeorm';
import { Product } from '../dataobject/Product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {}
