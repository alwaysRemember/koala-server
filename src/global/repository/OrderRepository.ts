import { EntityRepository, Repository } from 'typeorm';
/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:06:50
 * @LastEditTime: 2020-09-22 15:07:16
 * @FilePath: /koala-server/src/global/repository/OrderRepository.ts
 */
import { Order } from '../dataobject/Order.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {}
