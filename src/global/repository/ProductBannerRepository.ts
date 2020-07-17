/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:17:56
 * @LastEditTime: 2020-07-17 15:18:31
 * @FilePath: /koala-server/src/global/repository/ProductBannerRepository.ts
 */
import { Repository, EntityRepository } from 'typeorm';
import { ProductBanner } from '../dataobject/ProductBanner.entity';

@EntityRepository(ProductBanner)
export class ProductBannerRepository extends Repository<ProductBanner> {}
