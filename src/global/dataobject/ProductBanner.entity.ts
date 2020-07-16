/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-13 15:52:47
 * @LastEditTime: 2020-07-16 19:00:40
 * @FilePath: /koala-server/src/global/dataobject/ProductBanner.entity.ts
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './Product.entity';

@Entity('tb_product_banner')
export class ProductBanner {
  @PrimaryGeneratedColumn({
    comment: '商品图片id',
  })
  id: number;

  @Column({
    comment: '文件名',
  })
  fileName: string;

  @Column({
    comment: '图片地址',
  })
  url: string;

  @ManyToOne(
    type => Product,
    product => product.productBanner,
  )
  product: Product;

  @CreateDateColumn()
  createImage: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
