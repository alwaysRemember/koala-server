/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-18 14:02:45
 * @LastEditTime: 2020-11-30 16:13:29
 * @FilePath: /koala-server/src/global/dataobject/ProductConfig.entity.ts
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './Product.entity';

@Entity('tb_product_config')
export class ProductConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '归属分类名',
  })
  categoryName: string;

  @Column({
    comment: '配置名',
  })
  name: string;

  @Column({
    comment: '增加的金额',
  })
  amount: number;
  @Column({
    comment: '成本增加的金额',
    default: 0,
  })
  costAmount: number;

  @ManyToOne(
    type => Product,
    product => product.productConfigList,
  )
  product: Product;
}
