/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 18:13:51
 * @LastEditTime: 2020-07-01 18:46:26
 * @FilePath: /koala-background-server/src/global/repository/ClassificationRepository.ts
 */
import { Repository, EntityRepository } from 'typeorm';
import { Classification } from '../dataobject/Classification.entity';

@EntityRepository(Classification)
export class ClassificationRepository extends Repository<Classification> {}
