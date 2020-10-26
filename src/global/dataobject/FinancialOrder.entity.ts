/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-10-26 17:27:34
 * @LastEditTime: 2020-10-26 17:32:49
 * @FilePath: /koala-server/src/global/dataobject/FinancialOrder.entity.ts
 */
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EFinancialStatus } from '../enums/EOrder';
import { Order } from './Order.entity';

@Entity('tb_financial_order')
export class FinancialOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    type => Order,
    order => order.financialOrder,
  )
  order: Order;

  @Column({
    type: 'enum',
    enum: EFinancialStatus,
    default: EFinancialStatus.TO_BE_CHECKED_OUT,
    comment: '财务状态',
  })
  status: EFinancialStatus;
}
