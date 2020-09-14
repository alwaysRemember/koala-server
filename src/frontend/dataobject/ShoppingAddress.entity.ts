import { FrontUser } from 'src/global/dataobject/User.entity';
/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-14 15:23:51
 * @LastEditTime: 2020-09-14 16:50:40
 * @FilePath: /koala-server/src/frontend/dataobject/ShoppingAddress.entity.ts
 */

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tb_shopping_address')
export class ShoppingAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '收件人',
  })
  name: string;

  @Column({
    comment: '联系电话',
  })
  phone: string;

  @Column({
    type: 'json',
    comment: '地区',
  })
  area: Array<string>;

  @Column({
    comment: '详细地址',
  })
  address: string;

  @Column({
    type: 'boolean',
    comment: '是否默认选择',
    default: false,
  })
  isDefaultSelection: Boolean;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToOne(
    type => FrontUser,
    frontUser => frontUser.shoppingAddressList,
  )
  appletUser: FrontUser;
}
