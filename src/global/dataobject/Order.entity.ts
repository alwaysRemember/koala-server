import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-18 17:58:26
 * @LastEditTime: 2020-09-18 18:37:17
 * @FilePath: /koala-server/src/global/dataobject/Order.entity.ts
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
import { EOrderType } from '../enums/EOrder';
import { Product } from './Product.entity';
import { FrontUser } from './User.entity';

@Entity('tb_order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    type => BackendUser,
    backendUser => backendUser.orderList,
  )
  backendUser: BackendUser;

  @ManyToOne(
    type => FrontUser,
    frontUser => frontUser.orderList,
  )
  frontUser: FrontUser;

  @Column({
    comment: '订单金额',
  })
  amount: number;

  @OneToMany(
    type => Product,
    product => product.order,
  )
  productList: Array<Product>;

  @Column({
    type: 'json',
    comment: '每个产品的购买数量',
  })
  buyProductQuantityList: Array<{ productId: string; buyQuantity: number }>;

  @Column({
    comment: '运费',
  })
  orderShipping: number;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @Column({
    type: 'enum',
    enum: EOrderType,
    default: EOrderType.PENDING_PAYMENT,
    comment: '订单状态',
  })
  orderType: EOrderType;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;
}
