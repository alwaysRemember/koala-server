/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:02:26
 * @LastEditTime: 2020-09-22 15:04:22
 * @FilePath: /koala-server/src/global/dataobject/PayOrder.entity.ts
 */

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './Order.entity';

@Entity('tb_pay_order')
export class PayOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(
    type => Order,
    order => order.payOrder,
  )
  orderList: Array<Order>;

  @Column({
    comment: '支付金额',
  })
  payAmount: number;
}
