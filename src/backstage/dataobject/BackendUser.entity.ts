/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-01 18:53:23
 * @LastEditTime: 2020-07-13 15:43:48
 * @FilePath: /koala-server/src/backstage/dataobject/BackendUser.entity.ts
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  EBackendUserType,
  EbackendFindWithUserType,
} from '../enums/EBackendUserType';
import { Product } from 'src/global/dataobject/Product.entity';

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

  @OneToMany(
    type => Product,
    product => product.backendUser,
  )
  products: Array<Product>;

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
