/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 17:38:15
 * @LastEditTime: 2020-07-01 18:43:18
 * @FilePath: /koala-background-server/src/global/dataobject/Classification.entity.ts
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
@Entity('tb_classification')
export class Classification {
  @PrimaryGeneratedColumn({
    comment: '分类id',
  })
  classificationId: number;

  @Column({
    comment: '分类名',
  })
  classificationName: string;

  @Column({
    length: '2083',
    comment: '分类icon',
  })
  classificationImg: string;

  @Column({
    type: 'boolean',
    comment: '是否显示在主页上',
    default: false,
  })
  isShowOnHome: boolean;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: string;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: string;
}
