/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-06 16:37:58
 * @LastEditTime: 2020-11-06 16:38:32
 * @FilePath: /koala-server/src/global/repository/ProductCommentReposiotry.ts
 */

import { EntityRepository, Repository } from 'typeorm';
import { ProductComment } from '../dataobject/ProductComment.entity';

@EntityRepository(ProductComment)
export class ProductCommentReposiotry extends Repository<ProductComment> {}
