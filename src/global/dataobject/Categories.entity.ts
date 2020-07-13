/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 17:38:15
 * @LastEditTime: 2020-07-13 16:08:16
 * @FilePath: /koala-server/src/global/dataobject/Categories.entity.ts
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './Product.entity';

/**
 * 分类
 */
@Entity('tb_categories')
export class Categories {
  @PrimaryGeneratedColumn({
    comment: '分类id',
  })
  id: number;

  @Column({
    comment: '分类名',
  })
  categoriesName: string;

  @Column({
    comment: '文件名',
  })
  fileName: string;

  @Column({
    length: '2083',
    comment: '分类icon',
  })
  categoriesIconUrl: string;

  @Column({
    type: 'boolean',
    comment: '是否显示在主页上',
    default: false,
  })
  isShowOnHome: boolean;

  @Column({
    type: 'boolean',
    comment: '是否使用',
    default: true,
  })
  isUse: boolean;

  @OneToMany(
    type => Product,
    product => product.categories,
  )
  products: Array<Product>;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: string;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: string;
}
