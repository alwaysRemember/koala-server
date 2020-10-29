/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-10-29 18:13:34
 * @LastEditTime: 2020-10-29 18:37:43
 * @FilePath: /koala-server/src/global/dataobject/ProductComment.entity.ts
 */

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product.entity';

@Entity('tb_product_comment')
export class ProductComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '评价内容',
  })
  text: string;

  @Column({
    comment: '评价星级',
  })
  rate: number;

  @ManyToOne(
    type => Product,
    product => product.productCommentList,
  )
  product: Product;

  @CreateDateColumn()
  createTime: Date;
}
