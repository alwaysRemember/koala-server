/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-01 18:53:23
 * @LastEditTime: 2020-08-06 16:05:20
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

  @Column({
    comment: '邮箱',
  })
  email: string;

  @OneToMany(
    type => Product,
    product => product.backendUser,
  )
  products: Array<Product>;

  @Column({
    comment: '用户在小程序中的id',
  })
  appletUserId: number;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: string;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: string;
}
