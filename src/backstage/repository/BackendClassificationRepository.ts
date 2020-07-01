/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 18:13:51
 * @LastEditTime: 2020-07-01 18:15:09
 * @FilePath: /koala-background-server/src/backstage/repository/BackendClassificationRepository.ts
 */
import { Repository, EntityRepository } from 'typeorm';
import { BackendClassification } from '../dataobject/BackendClassification.entity';

@EntityRepository(BackendClassification)
export class BackendClassificationRepository extends Repository<
  BackendClassification
> {}
