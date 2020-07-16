/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-15 17:01:56
 * @LastEditTime: 2020-07-16 18:55:46
 * @FilePath: /koala-server/src/global/repository/ProductMediaLibraryRepository.ts
 */
import { Repository, EntityRepository } from 'typeorm';
import { ProductMediaLibrary } from '../dataobject/ProductMediaLibrary.entity';

@EntityRepository(ProductMediaLibrary)
export class ProductMediaLibraryRepository extends Repository<
  ProductMediaLibrary
> {}
