/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 14:38:08
 * @LastEditTime: 2020-06-23 18:23:08
 * @FilePath: /koala-background-server/src/global/dataobject/FrontUser.entity.ts
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EUserGender, EUserLanguage } from '../enums/EUserGlobal';

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
    type: 'enum',
    enum: EUserLanguage,
    default: EUserLanguage.ZH_CN,
    comment: '用户语言',
  })
  language: EUserLanguage;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: string;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: string;
}
