/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-13 15:52:47
 * @LastEditTime: 2020-07-13 16:08:47
 * @FilePath: /koala-server/src/global/dataobject/ProductImage.entity.ts
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

@Entity('tb_product_image')
export class ProductImage {
  @PrimaryGeneratedColumn({
    comment: '商品图片id',
  })
  id: number;

  @Column({
    comment: '图片地址',
  })
  url: string;

  @ManyToOne(
    type => Product,
    product => product.productImages,
  )
  product: Product;

  @CreateDateColumn()
  createImage: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
