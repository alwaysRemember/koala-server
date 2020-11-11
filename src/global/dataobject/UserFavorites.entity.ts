/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:47:18
 * @LastEditTime: 2020-11-11 15:22:59
 * @FilePath: /koala-server/src/global/dataobject/UserFavorites.entity.ts
 */

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product.entity';
import { FrontUser } from './User.entity';

@Entity('tb_user_favorites')
export class UserFavorites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '用户id',
  })
  userId: number;

  @OneToMany(
    type => Product,
    product => product.favorites,
  )
  productList: Array<Product>;
}
