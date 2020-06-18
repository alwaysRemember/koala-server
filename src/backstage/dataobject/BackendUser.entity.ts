/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-01 18:53:23
 * @LastEditTime: 2020-06-18 11:46:55
 * @FilePath: /koala-background-server/src/dataobject/BackendUser.entity.ts
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  EBackendUserType,
  EbackendFindWithUserType,
} from '../enums/EBackendUserType';

@Entity('tb_backend_user')
export class BackendUser {
  @PrimaryGeneratedColumn({ comment: '用户id' })
  userId: number;

  @Column({ length: 255, comment: '用户名' })
  username: string;

  @Column({ length: 255, comment: '用户密码' })
  password: string;

  @Column({
    type: 'enum',
    enum: EBackendUserType,
    default: EbackendFindWithUserType.PROXY,
    comment: '用户类型',
  })
  userType: EBackendUserType;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: string;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: string;

  constructor(
    userId: number,
    username: string,
    password: string,
    userType: EBackendUserType,
  ) {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.userType = userType;
  }
}
