/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:47:18
 * @LastEditTime: 2020-11-11 16:09:21
 * @FilePath: /koala-server/src/global/dataobject/UserFavorites.entity.ts
 */

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product.entity';
import { FrontUser } from './User.entity';

@Entity('tb_user_favorites')
export class UserFavorites {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => FrontUser,
    frontUser => frontUser.userFavoritesList,
  )
  user: FrontUser;

  @ManyToOne(
    type => Product,
    product => product.userFavoritesList,
  )
  product: Product;

  @CreateDateColumn()
  createTime: Date;
}
