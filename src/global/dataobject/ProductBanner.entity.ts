/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-13 15:52:47
 * @LastEditTime: 2020-07-17 16:11:31
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
    comment: '文件大小',
  })
  size: number;

  @Column({
    comment: '图片地址',
  })
  path: string;

  @Column({
    comment: '服务器地址',
  })
  relativePath: string;

  @ManyToOne(
    type => Product,
    product => product.productBanner,
  )
  product: Product;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
