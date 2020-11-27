/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-27 14:32:26
 * @LastEditTime: 2020-11-27 15:34:06
 * @FilePath: /koala-server/src/global/dataobject/ShoppingCart.entity.ts
 */

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product.entity';
import { FrontUser } from './User.entity';

@Entity('tb_shopping_cart')
export class ShoppingCart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    type => FrontUser,
    frontuser => frontuser.shoppingCartList,
  )
  user: FrontUser;

  @ManyToOne(
    type => Product,
    product => product.shoppingCartList,
  )
  product: Product;

  @Column({
    comment: '购买数量',
  })
  buyProductQuantity: number;

  @Column({
      type:"json",
    comment: '购买的配置',
  })
  buyProductConfigList: Array<number>;

  @CreateDateColumn()
  createTime: Date;
}
