/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-13 14:50:36
 * @LastEditTime: 2020-08-17 15:12:29
 * @FilePath: /koala-server/src/global/dataobject/ProductDetail.entity.ts
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Product } from './Product.entity';

@Entity('tb_product_detail')
export class ProductDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'longtext',
    comment: '产品详情',
  })
  productContent: string;

  @Column({
    type: 'longtext',
    comment: '产品简介',
  })
  productBrief: string;

  @Column({
    type: 'int',
    comment: '产品金额',
  })
  productAmount: number;

  @Column({
    type: 'json',
    comment: '产品简介',
  })
  productParameter: object;
}
