/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-28 17:09:01
 * @LastEditTime: 2020-07-28 17:09:23
 * @FilePath: /koala-server/src/global/repository/ProductMainImgRepository.ts
 */
import { Repository, EntityRepository } from 'typeorm';
import { ProductMainImg } from '../dataobject/ProductMainImg.entity';

@EntityRepository(ProductMainImg)
export class ProductMainImgRepository extends Repository<ProductMainImg> {}
