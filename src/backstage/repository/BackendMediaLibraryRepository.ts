/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-15 17:01:56
 * @LastEditTime: 2020-07-15 18:43:24
 * @FilePath: /koala-server/src/backstage/repository/BackendMediaLibraryRepository.ts
 */
import { Repository, EntityRepository } from 'typeorm';
import { BackendMediaLibrary } from '../dataobject/BackendMediaLibrary.entity';

@EntityRepository(BackendMediaLibrary)
export class BackendMediaLibraryRepository extends Repository<
  BackendMediaLibrary
> {}
