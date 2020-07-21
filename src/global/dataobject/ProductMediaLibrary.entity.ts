/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-15 16:57:30
 * @LastEditTime: 2020-07-21 14:39:13
 * @FilePath: /koala-server/src/global/dataobject/ProductMediaLibrary.entity.ts
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { EMediaType } from '../../backstage/enums/EMediaLibrary';
import { Product } from './Product.entity';

@Entity('tb_product_media_library')
export class ProductMediaLibrary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '文件名',
  })
  fileName: string;

  @Column({
    comment: '文件地址',
  })
  path: string;

  @Column({
    comment: '相对路径',
  })
  relativePath: string;

  @Column({
    type: 'enum',
    enum: EMediaType,
    default: EMediaType.IMAGE,
    comment: '文件类型',
  })
  type: EMediaType;

  @ManyToOne(
    type => Product,
    product => product.productMediaLibrary,
  )
  product: Product;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
