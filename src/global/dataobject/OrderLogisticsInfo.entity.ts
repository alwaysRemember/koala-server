/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-10-13 14:37:50
 * @LastEditTime: 2020-11-17 15:55:41
 * @FilePath: /koala-server/src/global/dataobject/OrderLogisticsInfo.entity.ts
 */

import { PrimaryGeneratedColumn, Entity, Column, OneToOne } from 'typeorm';
import { EOrderExpressStatus } from '../enums/EOrder';
import { IExpressDataItem } from '../interface/IExpress';
import { Order } from './Order.entity';

@Entity('tb_order_logistics_info')
export class OrderLogisticsInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '快递名称',
    default:"",
  })
  name: string;

  @Column({
    comment: '快递代码',
    default:"",
  })
  code: string;

  @Column({
    comment: '快递单号',
    default:"",
  })
  num: string;

  @Column({
    type: 'enum',
    enum: EOrderExpressStatus,
    default: EOrderExpressStatus.POLLING,
    comment: '快递监控状态',
  })
  expressStatus: EOrderExpressStatus;

  @Column({
    comment: '签收状态',
    default: null,
  })
  signStatus: string;

  @Column({
    type: 'json',
    default: null,
    comment: '快递监控信息',
  })
  expressData: Array<IExpressDataItem>;

  @OneToOne(
    type => Order,
    order => order.logisticsInfo,
  )
  order: Order;
}
