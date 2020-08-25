/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-13 14:39:25
 * @LastEditTime: 2020-08-25 16:28:07
 * @FilePath: /koala-server/src/global/dataobject/Product.entity.ts
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Categories } from './Categories.entity';
import { ProductDetail } from './ProductDetail.entity';
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { EProductStatus } from '../enums/EProduct';
import { ProductBanner } from './ProductBanner.entity';
import { ProductVideo } from './ProductVideo.entity';
import { ProductMediaLibrary } from './ProductMediaLibrary.entity';
import { ProductMainImg } from './ProductMainImg.entity';
import { ProductConfig } from './ProductConfig.entity';
import { AppletHomeBanner } from './AppletHomeBanner.entity';

@Entity('tb_product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: '产品名',
  })
  productName: string;

  @Column({
    type: 'enum',
    enum: EProductStatus,
    default: EProductStatus.OFF_SHELF,
    comment: '产品状态',
  })
  productStatus: EProductStatus;

  @Column({
    type: 'boolean',
    default: true,
    comment: '是否为7天无理由商品',
  })
  productType: boolean;

  @Column({
    default: false,
    comment: '是否已删除',
  })
  isDel: boolean;

  @ManyToOne(
    type => Categories,
    category => category.products,
  )
  categories: Categories;

  @Column({
    length: 36,
    comment: '商品详情id',
  })
  productDetailId: string;

  @OneToMany(
    type => ProductBanner,
    productBanner => productBanner.product,
  )
  productBanner: Array<ProductBanner>;

  @OneToMany(
    type => ProductVideo,
    productVideo => productVideo.product,
  )
  productVideo: Array<ProductVideo>;

  @ManyToOne(
    type => BackendUser,
    backendUser => backendUser.products,
  )
  backendUser: BackendUser;

  @OneToMany(
    type => ProductMediaLibrary,
    productMediaLibrary => productMediaLibrary.product,
  )
  productMediaLibrary: Array<ProductMediaLibrary>;

  @OneToMany(
    type => ProductConfig,
    productConfig => productConfig.product,
  )
  productConfigList: Array<ProductConfig>;

  @OneToOne(
    type => AppletHomeBanner,
    appletHomebanner => appletHomebanner.product,
  )
  appletHomeBanner: AppletHomeBanner;

  @Column({
    length: 36,
    comment: '商品主图id',
  })
  productMainImgId: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;
}
