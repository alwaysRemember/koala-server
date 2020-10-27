/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-10-27 17:03:50
 * @LastEditTime: 2020-10-27 17:04:15
 * @FilePath: /koala-server/src/global/repository/OrderRefundRepository.ts
 */
import { EntityRepository, Repository } from 'typeorm';
import { OrderRefund } from '../dataobject/OrderRefund.entity';

@EntityRepository(OrderRefund)
export class OrderRefundRepository extends Repository<OrderRefund> {}
