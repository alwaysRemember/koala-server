/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-07 15:34:31
 * @LastEditTime: 2020-08-07 15:40:19
 * @FilePath: /koala-server/src/global/dataobject/AppletHomeBannerImg.entity.ts
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { AppletHomeBanner } from './AppletHomeBanner.entity';

@Entity('tb_applet_home_banner_img')
export class AppletHomeBannerImg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '图片地址',
  })
  path: string;

  @Column({
    comment: '本机地址',
  })
  relativePath: string;

  @Column({
    comment: '文件名',
  })
  fileName: string;

  @OneToOne(
    type => AppletHomeBanner,
    appletHomeBanner => appletHomeBanner.bannerImg,
  )
  banner: AppletHomeBanner;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
