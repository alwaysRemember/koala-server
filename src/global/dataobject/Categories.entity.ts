/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 17:38:15
 * @LastEditTime: 2020-07-23 14:36:27
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: '分类名',
  })
  categoriesName: string;

  @Column({
    comment: '文件名',
  })
  fileName: string;

  @Column({
    comment: '访问链接',
  })
  categoriesIconUrl: string;

  @Column({
    comment: '相对路径',
  })
  relativePath: string;

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
