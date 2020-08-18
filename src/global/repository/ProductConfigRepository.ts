/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-18 14:07:41
 * @LastEditTime: 2020-08-18 14:08:21
 * @FilePath: /koala-server/src/global/repository/ProductConfigRepository.ts
 */

import { Repository, EntityRepository } from 'typeorm';
import { ProductConfig } from '../dataobject/ProductConfig.entity';

@EntityRepository(ProductConfig)
export class ProductConfigRepository extends Repository<ProductConfig> {}
