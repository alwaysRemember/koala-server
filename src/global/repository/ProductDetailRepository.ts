/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-20 18:18:20
 * @LastEditTime: 2020-07-20 18:30:44
 * @FilePath: /koala-server/src/global/repository/ProductDetailRepository.ts
 */
import { Repository, EntityRepository } from 'typeorm';
import { ProductDetail } from '../dataobject/ProductDetail.entity';

@EntityRepository(ProductDetail)
export class ProductDetailRepository extends Repository<ProductDetail> {}
