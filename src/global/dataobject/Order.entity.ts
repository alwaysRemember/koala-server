import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { ShoppingAddress } from 'src/frontend/dataobject/ShoppingAddress.entity';
import {
  IOrderRemarkParams,
  IShoppingAddress,
} from 'src/frontend/interface/IFrontOrder';
/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-18 17:58:26
 * @LastEditTime: 2020-10-23 18:19:38
 * @FilePath: /koala-server/src/global/dataobject/Order.entity.ts
 */

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  EOrderRefundAccount,
  EOrderRefundStatus,
  EOrderType,
} from '../enums/EOrder';
import { OrderLogisticsInfo } from './OrderLogisticsInfo.entity';
import { OrderRefund } from './OrderRefund.entity';
import { PayOrder } from './PayOrder.entity';
import { Product } from './Product.entity';
import { FrontUser } from './User.entity';

@Entity('tb_order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    type => BackendUser,
    backendUser => backendUser.orderList,
  )
  backendUser: BackendUser;

  @ManyToOne(
    type => FrontUser,
    frontUser => frontUser.orderList,
  )
  frontUser: FrontUser;

  @Column({
    comment: '订单金额',
  })
  amount: number;

  @ManyToMany(
    type => Product,
    product => product.orderList,
  )
  productList: Array<Product>;

  @Column({
    type: 'json',
    comment: '每个产品的购买数量',
  })
  buyProductQuantityList: Array<{ productId: string; buyQuantity: number }>;

  @Column({
    type: 'json',
    comment: '每个产品购买的产品配置',
  })
  buyProductConfigList: Array<{ productId: string; configList: Array<number> }>;

  @Column({
    comment: '运费',
  })
  orderShopping: number;

  @Column({
    type: 'json',
    comment: '收货地址',
  })
  shoppingAddress: IShoppingAddress;

  @Column({
    type: 'json',
    comment: '用户基于每个产品的备注',
  })
  remarkList: Array<IOrderRemarkParams>;

  @Column({
    type: 'enum',
    enum: EOrderType,
    default: EOrderType.PENDING_PAYMENT,
    comment: '订单状态',
  })
  orderType: EOrderType;

  @ManyToOne(
    type => PayOrder,
    payOrder => payOrder.orderList,
  )
  payOrder: PayOrder;

  @Column({
    comment: '订单自动取消时间',
  })
  expiration: string;

  @OneToOne(
    type => OrderLogisticsInfo,
    orderLogisticsInfo => orderLogisticsInfo.order,
  )
  @JoinColumn()
  logisticsInfo: OrderLogisticsInfo;

  @Column({
    comment: '微信退款单号',
    default: null,
  })
  refundId: string;

  @Column({
    comment: '商户退款单号',
    default: null,
  })
  outRefundNo: string;

  @Column({
    type: 'enum',
    enum: EOrderRefundStatus,
    default: null,
    comment: '退款状态',
  })
  refundStatus: EOrderRefundStatus;

  @Column({
    type: 'enum',
    enum: EOrderRefundAccount,
    default: null,
    comment: '退款资金来源',
  })
  refundAccount: EOrderRefundAccount;

  @Column({
    comment: '退款入账账户',
    default: null,
  })
  refundRecvAccount: string;

  @Column({
    comment: '退款成功时间',
    default: null,
  })
  refundSuccessTime: string;

  @OneToOne(
    type => OrderRefund,
    orderRefund => orderRefund.order,
  )
  @JoinColumn()
  orderRefund: OrderRefund;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;
}
