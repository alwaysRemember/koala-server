/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-20 12:19:58
 * @LastEditTime: 2020-07-20 12:20:23
 * @FilePath: /koala-server/src/global/repository/ProductVideoRepository.ts
 */
import { Repository, EntityRepository } from 'typeorm';
import { ProductVideo } from '../dataobject/ProductVideo.entity';

@EntityRepository(ProductVideo)
export class ProductVideoRepository extends Repository<ProductVideo> {}
