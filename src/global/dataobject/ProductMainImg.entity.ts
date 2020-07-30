/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-28 17:05:53
 * @LastEditTime: 2020-07-28 17:07:30
 * @FilePath: /koala-server/src/global/dataobject/ProductMainImg.entity.ts
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

@Entity('tb_product_main_img')
export class ProductMainImg {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: '主图地址',
  })
  path: string;

  @Column({
    comment: '服务器主图地址',
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


}
