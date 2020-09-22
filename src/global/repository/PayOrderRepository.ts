/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:07:40
 * @LastEditTime: 2020-09-22 15:08:04
 * @FilePath: /koala-server/src/global/repository/PayOrderRepository.ts
 */

import { EntityRepository, Repository } from 'typeorm';
import { PayOrder } from '../dataobject/PayOrder.entity';

@EntityRepository(PayOrder)
export class PayOrderRepository extends Repository<PayOrder> {}
