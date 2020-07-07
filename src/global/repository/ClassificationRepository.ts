/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 18:13:51
 * @LastEditTime: 2020-07-07 16:10:41
 * @FilePath: /koala-server/src/global/repository/ClassificationRepository.ts
 */
import { Repository, EntityRepository } from 'typeorm';
import { Categories } from '../dataobject/Categories.entity';

@EntityRepository(Categories)
export class ClassificationRepository extends Repository<Categories> {}
