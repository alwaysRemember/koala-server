/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 18:13:51
 * @LastEditTime: 2020-07-08 16:42:38
 * @FilePath: /koala-server/src/global/repository/CategoriesRepository.ts
 */
import { Repository, EntityRepository } from 'typeorm';
import { Categories } from '../dataobject/Categories.entity';

@EntityRepository(Categories)
export class CategoriesRepository extends Repository<Categories> {}
