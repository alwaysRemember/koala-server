/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-13 14:39:25
 * @LastEditTime: 2020-07-16 19:01:05
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
import { ProductsDetail } from './ProductDetail.entity';
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { EProductStatus } from '../enums/EProduct';
import { ProductBanner } from './ProductBanner.entity';
import { ProductVideo } from './ProductVideo.entity';
import { ProductMediaLibrary } from './ProductMediaLibrary.entity';

@Entity('tb_product')
export class Product {
  @PrimaryGeneratedColumn({
    comment: '产品id',
  })
  id: number;

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

  @ManyToOne(
    type => Categories,
    category => category.products,
  )
  categories: Categories;

  @OneToOne(
    type => ProductsDetail,
    productsDetail => productsDetail.products,
  )
  @JoinColumn()
  productDetail: ProductsDetail;

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

  @OneToOne(
    type => ProductMediaLibrary,
    productMediaLibrary => productMediaLibrary.product,
  )
  productMediaLibrary: ProductMediaLibrary;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;
}
