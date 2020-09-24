/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:02:26
 * @LastEditTime: 2020-09-24 17:48:38
 * @FilePath: /koala-server/src/global/dataobject/PayOrder.entity.ts
 */

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './Order.entity';
import { FrontUser } from './User.entity';

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

  @Column({
    comment: '支付银行卡',
    default: '',
  })
  bankType: string;

  @Column({
    comment: '货币种类',
    default: '',
  })
  feeType: string;

  @Column({
    comment: '商户ID',
    default: '',
  })
  mchId: string;

  @ManyToOne(type => FrontUser)
  frontUser: FrontUser;

  @Column({
    comment: '商户订单号',
    default: '',
  })
  outTradeNo: string;

  @Column({
    comment: '付款成功时间',
    default: '',
  })
  timeEnd: string;

  @Column({
    comment: '支付金额',
    default: 0,
  })
  cashFee: number;

  @Column({
    comment: '订单自动取消时间',
  })
  expiration: number;

  @Column({
    comment: '微信支付订单号',
    default: '',
  })
  transactionId: string;
}
