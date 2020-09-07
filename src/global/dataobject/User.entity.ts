/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 14:38:08
 * @LastEditTime: 2020-09-07 16:37:26
 * @FilePath: /koala-server/src/global/dataobject/User.entity.ts
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { EUserGender, EUserLanguage } from '../enums/EUserGlobal';
import { Product } from './Product.entity';

@Entity('tb_front_user')
export class FrontUser {
  @PrimaryGeneratedColumn({
    comment: '用户id',
  })
  userId: number;

  @Column({
    length: 255,
    comment: '用户微信标识',
  })
  openid: string;

  @Column({
    length: 255,
    comment: '用户会话密钥',
  })
  sessionKey: string;

  @Column({
    length: 255,
    comment: '用户名',
  })
  nickName: string;

  @Column({
    length: 255,
    comment: '用户头像',
  })
  avatarUrl: string;

  @Column({
    type: 'enum',
    enum: EUserGender,
    default: EUserGender.UNKONWN,
    comment: '用户性别',
  })
  gender: EUserGender;

  @Column({
    length: 255,
    comment: '国家',
  })
  country: string;

  @Column({
    length: 255,
    comment: '省份',
  })
  province: string;

  @Column({
    length: 255,
    comment: '城市',
  })
  city: string;

  @Column({
    comment: '手机号',
    default: null,
  })
  phone: string;

  @Column({
    type: 'enum',
    enum: EUserLanguage,
    default: EUserLanguage.ZH_CN,
    comment: '用户语言',
  })
  language: EUserLanguage;

  @ManyToMany(
    type => Product,
    product => product.favoriteUserList,
  )
  @JoinTable({
    name: 'tb_favorite_product',
  })
  favoriteProductList: Array<Product>;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: string;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: string;
}
