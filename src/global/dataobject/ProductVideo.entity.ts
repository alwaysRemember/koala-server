/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-13 16:22:32
 * @LastEditTime: 2020-07-23 14:37:59
 * @FilePath: /koala-server/src/global/dataobject/ProductVideo.entity.ts
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Product } from './Product.entity';

@Entity('tb_product_video')
export class ProductVideo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: '视频地址',
  })
  path: string;

  @Column({
    comment: '服务器视频地址',
  })
  relativePath: string;

  @Column({
    comment: '文件名',
  })
  fileName: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToOne(
    type => Product,
    product => product.productVideo,
  )
  product: Product;
}
