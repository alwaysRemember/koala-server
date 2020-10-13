/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-10-13 14:37:50
 * @LastEditTime: 2020-10-13 14:45:41
 * @FilePath: /koala-server/src/global/dataobject/OrderLogisticsInfo.entity.ts
 */

import { PrimaryGeneratedColumn, Entity, Column, OneToOne } from 'typeorm';
import { Order } from './Order.entity';

@Entity('tb_order_logistics_info')
export class OrderLogisticsInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '快递名称',
  })
  name: string;

  @Column({
    comment: '快递代码',
  })
  code: string;

  @Column({
    comment: '快递单号',
  })
  num: string;

  @OneToOne(
    type => Order,
    order => order.logisticsInfo,
  )
  order: Order;
}
