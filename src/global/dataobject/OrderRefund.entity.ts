/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-10-23 18:14:54
 * @LastEditTime: 2020-10-27 16:59:09
 * @FilePath: /koala-server/src/global/dataobject/OrderRefund.entity.ts
 */

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './Order.entity';

@Entity('tb_order_refund')
export class OrderRefund {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '退款原因',
  })
  reason: string;

  @Column({
    default: null,
    comment: '退款快递名',
  })
  courierName: string;

  @Column({
    comment: '退款快递单号',
    default: null,
  })
  trackingNumber: string;

  @OneToOne(
    type => Order,
    order => order.orderRefund,
  )
  order: Order;

  @CreateDateColumn()
  createTime: Date;
}
