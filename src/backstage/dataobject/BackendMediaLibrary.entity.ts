/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-15 16:57:30
 * @LastEditTime: 2020-07-15 19:10:58
 * @FilePath: /koala-server/src/backstage/dataobject/BackendMediaLibrary.entity.ts
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EMediaType } from '../enums/EMediaLibrary';

@Entity('tb_media_library')
export class BackendMediaLibrary {
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

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
