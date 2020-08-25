/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-07 15:24:30
 * @LastEditTime: 2020-08-25 16:35:50
 * @FilePath: /koala-server/src/global/dataobject/AppletHomeBanner.entity.ts
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { EAppletHomeBannerTypeEnum } from '../enums/EAppletHomeBanner';
import { AppletHomeBannerImg } from './AppletHomeBannerImg.entity';
import { Product } from './Product.entity';

@Entity('tb_applet_home_banner')
export class AppletHomeBanner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EAppletHomeBannerTypeEnum,
    default: EAppletHomeBannerTypeEnum.PRODUCT,
    comment: 'banner类型',
  })
  type: EAppletHomeBannerTypeEnum;

  @OneToOne(
    type => Product,
    product => product.appletHomeBanner,
  )
  @JoinColumn()
  product: Product;

  @OneToOne(
    type => AppletHomeBannerImg,
    applethomeBannerImg => applethomeBannerImg.banner,
  )
  @JoinColumn()
  bannerImg: AppletHomeBannerImg;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
