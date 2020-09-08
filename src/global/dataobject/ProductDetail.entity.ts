/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-13 14:50:36
 * @LastEditTime: 2020-09-08 15:02:13
 * @FilePath: /koala-server/src/global/dataobject/ProductDetail.entity.ts
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

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
    type: 'int',
    comment: '产品运费',
    default: 0,
  })
  productShipping: number;

  @Column({
    comment: '发货地',
    default: null,
  })
  productDeliveryCity: string;

  @Column({
    type: 'json',
    comment: '产品简介',
  })
  productParameter: Array<{ key: string; value: string }>;
}
