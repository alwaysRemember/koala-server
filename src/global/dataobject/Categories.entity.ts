/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 17:38:15
 * @LastEditTime: 2020-07-07 16:24:08
 * @FilePath: /koala-server/src/global/dataobject/Categories.entity.ts
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 分类
 */
@Entity('tb_categories')
export class Categories {
  @PrimaryGeneratedColumn({
    comment: '分类id',
  })
  categoriesId: number;

  @Column({
    comment: '分类名',
  })
  categoriesName: string;

  @Column({
    length: '2083',
    comment: '分类icon',
  })
  categoriesLogo: string;

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

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: string;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: string;
}
