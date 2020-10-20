/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:12:34
 * @LastEditTime: 2020-10-20 17:54:24
 * @FilePath: /koala-server/src/frontend/service/OrderService.ts
 */

import { HttpException, Injectable } from '@nestjs/common';
import Axios from 'axios';
import { config } from 'rxjs';
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { appId, mchId } from 'src/config/projectConfig';
import { Order } from 'src/global/dataobject/Order.entity';
import { PayOrder } from 'src/global/dataobject/PayOrder.entity';
import { Product } from 'src/global/dataobject/Product.entity';
import { ProductConfig } from 'src/global/dataobject/ProductConfig.entity';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { ProductMainImg } from 'src/global/dataobject/ProductMainImg.entity';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { EOrderExpiration, EOrderType } from 'src/global/enums/EOrder';
import { EProductStatus } from 'src/global/enums/EProduct';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { OrderRepository } from 'src/global/repository/OrderRepository';
import { PayOrderRepository } from 'src/global/repository/PayOrderRepository';
import { ProductConfigRepository } from 'src/global/repository/ProductConfigRepository';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { ProductMainImgRepository } from 'src/global/repository/ProductMainImgRepository';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { Mail } from 'src/utils/Mail';
import { reportErr } from 'src/utils/ReportError';
import { EntityManager, getManager, LessThanOrEqual, Not } from 'typeorm';
import { ShoppingAddress } from '../dataobject/ShoppingAddress.entity';
import { FrontException } from '../exception/FrontException';
import {
  ICreateOrderParams,
  IGetOrderListRequestParams,
  IOrderItem,
} from '../form/IFrontOrder';
import {
  ICreateOrderResponse,
  IGetOrderListResponse,
  IProductItem,
  IShoppingAddress,
} from '../interface/IFrontOrder';
import { ShoppingAddressRepository } from '../repository/ShoppingAddressRepository';
import { WxPay } from '../wxPay';
import { ETradeType } from '../wxPay/enums';
import { FrontUserService } from './UserService';

@Injectable()
export class OrderService {
  private cancelType: Array<EOrderType> = [
    EOrderType.PENDING_PAYMENT,
    EOrderType.TO_BE_DELIVERED,
  ];
  private returnOfGoodsType: Array<EOrderType> = [
    EOrderType.TO_BE_RECEIVED,
    EOrderType.COMMENT,
    EOrderType.FINISHED,
  ];

  private paymentType: Array<EOrderType> = [EOrderType.PENDING_PAYMENT];

  private confirmReceiptType: Array<EOrderType> = [EOrderType.TO_BE_RECEIVED];

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly payOrderRepository: PayOrderRepository,
    private readonly frontUserService: FrontUserService,
    private readonly shoppingAddressRepository: ShoppingAddressRepository,
    private readonly productRepository: ProductRepository,
    private readonly productDetailRepository: ProductDetailRepository,
    private readonly frontUserRepository: FrontUserRepository,
    private readonly productConfigRepository: ProductConfigRepository,
    private readonly productMainImgRepository: ProductMainImgRepository,
  ) {}

  /**
   * 创建订单
   * @param data
   */
  async createOrder(
    data: ICreateOrderParams,
    openid: string,
  ): Promise<ICreateOrderResponse> {
    try {
      let address: ShoppingAddress;
      let productList: Array<Product>;

      // 获取用户
      const user = await this.frontUserService.findByOpenid(openid);
      // 查询收货地址是否可以用
      try {
        address = await this.shoppingAddressRepository.findOne(data.addressId, {
          join: {
            alias: 'address',
            leftJoinAndSelect: {
              appletUser: 'address.appletUser',
            },
          },
        });
      } catch (e) {
        await reportErr('获取收货地址信息失败', e);
      }
      !address && (await reportErr('获取不到当前的收货地址'));
      // 判断当前地址是否属于当前用户
      address.appletUser.userId !== user.userId &&
        (await reportErr('当前的收货地址不属于登录用户'));

      // 获取产品
      try {
        productList = await this.productRepository.findByIds(
          data.buyProductList.map(item => item.productId),
          {
            join: {
              alias: 'product',
              leftJoinAndSelect: {
                productConfigList: 'product.productConfigList',
                backendUser: 'product.backendUser',
              },
            },
            where: {
              isDel: false,
              productStatus: EProductStatus.PUT_ON_SHELF,
            },
          },
        );
      } catch (e) {
        await reportErr('获取产品信息失败', e);
      }
      // 判断是否所有产品都可以购买
      productList.length !== data.buyProductList.length &&
        (await reportErr('当前选择的产品中存在不可购买产品'));
      // 判断是否选择了商品配置
      await this.isSelectProductConfig(data.buyProductList, productList);

      // 按照代理分类商品（同时购买多个代理的多个商品的时候，按照代理进行创建订单）
      const orderList = await this.createOrderList(
        productList,
        user,
        data.buyProductList,
        {
          name: address.name,
          address: address.address,
          area: address.area,
          phone: address.phone,
        },
      );
      // 创建支付订单记录
      const payOrder = new PayOrder();
      payOrder.orderList = orderList;
      payOrder.payAmount = orderList.reduce(
        (prev, current) => prev + current.amount,
        0,
      );

      payOrder.frontUser = user;
      const result = await getManager()
        .transaction<ICreateOrderResponse>(
          async (entityManager: EntityManager) => {
            await entityManager.save(Order, orderList);
            const payOrderResult = await entityManager.save(PayOrder, payOrder);
            const wxPay = new WxPay({
              appid: appId,
              mchId,
              tradeType: ETradeType.JSAPI,
            });
            const {
              timeStamp,
              nonceStr,
              package: pg,
              paySign,
            } = await wxPay.createWxPayOrder({
              body: 'GO购-商品购买',
              amount: payOrder.payAmount,
              orderId: payOrderResult.id,
              openId: openid,
            });
            return {
              timeStamp,
              nonceStr,
              package: pg,
              paySign,
              orderId: payOrderResult.id,
            };
          },
        )
        .catch(async e => {
          await reportErr('创建订单失败', e);
        });
      return result as ICreateOrderResponse;
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 根据支付id获取订单
   * @param payOrderId
   */
  async getPayOrder(payOrderId): Promise<Array<string>> {
    try {
      try {
        const db = this.payOrderRepository.createQueryBuilder('payOrder');
        const data = await db
          .select(['order.id as id'])
          .leftJoin(Order, 'order', 'order.payOrderId=payOrder.id')
          .andWhere('payOrder.id = :id', { id: payOrderId })
          .getRawMany();
        return data.filter(item => item.id).map(item => item.id);
      } catch (e) {
        await reportErr('获取订单数据失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  // 根据订单过期时间修改订单状态
  async updateOrderTypeByOrderExpiration() {
    await getManager().transaction(
      'READ COMMITTED',
      async (entityManager: EntityManager) => {
        // 查询出已过期并且订单状态为待支付的订单
        const list = await entityManager.find(Order, {
          where: {
            expiration: LessThanOrEqual(new Date().getTime()),
            orderType: EOrderType.PENDING_PAYMENT,
          },
        });
        if (!list.length) return;
        await entityManager.update(
          Order,
          list.map(item => item.id),
          {
            orderType: EOrderType.CANCEL,
          },
        );
      },
    );
  }

  /**
   * 获取订单列表
   * @param params
   * @param openid
   */
  async getOrderList(
    { page, orderType }: IGetOrderListRequestParams,
    openid,
  ): Promise<IGetOrderListResponse> {
    const TAKE_NUM = 10;
    try {
      // 获取用户
      const user = await this.frontUserService.findByOpenid(openid);

      try {
        const db = this.orderRepository.createQueryBuilder('order');
        db.leftJoin('order.frontUser', 'frontUser');
        db.leftJoinAndSelect('order.productList', 'productList');
        db.andWhere('order.frontUser.userId=:id', { id: user.userId });
        // 判断订单状态
        if (orderType !== 'ALL') {
          db.andWhere('order.orderType =:orderType', { orderType });
        }

        const data = await db
          .skip((page - 1) * TAKE_NUM)
          .take(TAKE_NUM)
          .addOrderBy('order.createTime', 'DESC')
          .getMany();
        let total = await db.getCount();
        total = Math.ceil(total / TAKE_NUM);
        return {
          total,
          list: await Promise.all(
            data.map(async item => ({
              orderId: item.id,
              orderType: item.orderType,
              amount: item.amount,
              updateTime: item.updateTime,
              productList: await Promise.all(
                item.productList.map(async d => {
                  // 提取产品配置的id
                  const productConfigIdList = item.buyProductConfigList?.find(
                    item => item.productId === d.id,
                  ).configList;
                  const productConfig: Array<ProductConfig> = await this.productConfigRepository.findByIds(
                    productConfigIdList || [],
                  );
                  const {
                    productAmount: amount,
                  }: ProductDetail = await this.productDetailRepository.findOne(
                    d.productDetailId,
                  );
                  const {
                    path: img,
                  }: ProductMainImg = await this.productMainImgRepository.findOne(
                    d.productMainImgId,
                  );
                  return {
                    productId: d.id,
                    name: d.productName,
                    buyQuantity: item.buyProductQuantityList.find(
                      item => item.productId === d.id,
                    ).buyQuantity,
                    productConfigList: productConfig.map(i => i.name),
                    amount,
                    img,
                  };
                }),
              ),
            })),
          ),
        };
      } catch (e) {
        await reportErr('获取订单列表失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 创建订单列表
   * @param productList
   * @param frontUser
   */
  private async createOrderList(
    productList: Array<Product>,
    frontUser: FrontUser,
    buyProductList: Array<IOrderItem>,
    shoppingAddress: IShoppingAddress,
  ): Promise<Array<Order>> {
    return await Promise.all(
      productList
        .reduce<
          Array<{
            user: BackendUser;
            productList: Array<Product>;
          }>
        >((prev, current) => {
          // 判断是否已经有了当前用户
          const index = prev.findIndex(
            value => value.user === current.backendUser,
          );
          if (index > -1) {
            // 存在则直接添加到代理分类中
            prev[index].productList = prev[index].productList.concat([current]);
          } else {
            // 不存在则创建新的
            prev.push({
              user: current.backendUser,
              productList: [current],
            });
          }
          return prev;
        }, [])
        .map(
          async ({
            user,
            productList,
          }: {
            user: BackendUser; // 按代理分类后的当前代理
            productList: Array<Product>; // 购买当前代理下的产品列表
          }) => {
            let orderShopping: number = 0; // 运费
            const order = new Order();
            // 订单金额=((商品默认金额+商品配置金额)*商品数量+运费)^n
            const orderAmount = await (
              await Promise.all(
                productList.map(async ({ id: productId }) => {
                  const {
                    selectProductConfigList,
                    buyQuantity,
                  } = buyProductList.find(item => item.productId === productId);
                  const product = productList.find(v => (v.id = productId));
                  const productDetail = await this.productDetailRepository.findOne(
                    product.productDetailId,
                  );
                  // 计算选择的配置金额
                  const configAmountList = selectProductConfigList.map(id => {
                    const config = product.productConfigList.find(
                      v => v.id === id,
                    );
                    return config.amount;
                  });
                  orderShopping += productDetail.productShipping;
                  // 金额相加
                  return (
                    configAmountList.reduce(
                      (prev, current) => prev + current,
                      productDetail.productAmount,
                    ) *
                      buyQuantity +
                    productDetail.productShipping
                  );
                }),
              )
            ).reduce((prev, current) => prev + current, 0);

            order.backendUser = user;
            order.frontUser = frontUser;
            order.amount = orderAmount;
            order.productList = productList;
            order.buyProductQuantityList = buyProductList.map(item => ({
              productId: item.productId,
              buyQuantity: item.buyQuantity,
            }));
            order.buyProductConfigList = buyProductList.map(item => ({
              productId: item.productId,
              configList: item.selectProductConfigList,
            }));
            order.orderShopping = orderShopping;
            order.remarkList = buyProductList.map(item => ({
              productId: item.productId,
              remark: item.remarks,
            }));
            order.orderType = EOrderType.PENDING_PAYMENT;
            order.shoppingAddress = shoppingAddress;
            order.expiration = String(
              new Date().getTime() + EOrderExpiration.CANCEL,
            );
            return order;
          },
        ),
    );
  }
  /**
   * 取消订单
   * @param orderId
   */
  async cancelOrder(orderId: string) {
    try {
      let order: Order;
      try {
        order = await this.orderRepository.findOne(orderId, {
          join: {
            alias: 'order',
            leftJoinAndSelect: {
              payOrder: 'order.payOrder',
              backendUser: 'order.backendUser',
              productList: 'order.productList',
            },
          },
        });
      } catch (e) {
        await reportErr('获取订单信息失败', e);
      }
      if (!order) await reportErr('不存在当前要取消的订单');

      // 判断状态是否合理
      if (this.cancelType.indexOf(order.orderType) === -1)
        await reportErr('当前订单状态不允许进行此操作');

      // 如果是待付款的状态直接改变订单状态就行
      if (order.orderType === EOrderType.PENDING_PAYMENT) {
        order.orderType = EOrderType.CANCEL;
        try {
          await this.orderRepository.update(order.id, order);
        } catch (e) {
          await reportErr('取消订单失败', e);
        }
      }
      // 如果是待发货状态则需要退款，并且把状态改为退款中
      if (order.orderType === EOrderType.TO_BE_DELIVERED) {
        await getManager()
          .transaction(async (entityManager: EntityManager) => {
            // 修改订单状态
            await entityManager.update(Order, order.id, {
              orderType: EOrderType.REFUNDING,
            });
            // 发起退款
            await this.returnOfGoods(order);
          })
          .catch(async e => {
            await reportErr('取消订单失败', e);
          });
      }
      try {
        new Mail(
          '有用户取消订单，请尽快处理!!',
          {
            订单ID: order.id,
            商品: `${order.productList.map(
              p =>
                `${p.productName} x${
                  order.buyProductQuantityList.find(b => b.productId === p.id)
                    ?.buyQuantity
                }\n`,
            )}`,
            收货信息: `${Object.keys(order.shoppingAddress)
              .map(key => order.shoppingAddress[key])
              .join('\n')}`,
          },
          order.backendUser.email,
        ).send();
      } catch (e) {}
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 订单退货
   * @param order
   * @param refundDesc 退款原因
   */
  private async returnOfGoods(order: Order, refundDesc?: string) {
    const wxPay = new WxPay({
      appid: appId,
      mchId,
      tradeType: ETradeType.JSAPI,
    });
    const payOrder = await this.payOrderRepository.findOne(order.payOrder.id);
    await wxPay.returnOfGoods({
      transactionId: payOrder.transactionId,
      refundFee: order.amount,
      totalFee: payOrder.payAmount,
      refundDesc: refundDesc ? refundDesc : `订单号: ${order.id} 发起退款`,
    });
  }

  /**
   * 判断购买的产品中是否选择了对应的产品配置
   * @param buyProductList
   * @param productList
   */
  private async isSelectProductConfig(
    buyProductList: Array<IOrderItem>,
    productList: Array<Product>,
  ) {
    await Promise.all(
      buyProductList.map(async ({ productId, selectProductConfigList }) => {
        const currentProduct = productList.find(
          value => value.id === productId,
        );
        // 获取当前商品的配置分类
        const productConfig = currentProduct.productConfigList.reduce<
          Array<{ categoryName: string; id: number }>
        >((prev, { id, categoryName }) => {
          if (!prev.find(value => value.categoryName === categoryName)) {
            prev.push({
              categoryName,
              id,
            });
          }
          return prev;
        }, []);
        // 判断产品配置是否都正常选择了
        if (productConfig.length === selectProductConfigList.length) return;

        // 获取当前商品未选择的配置分类
        const currentProductNoSelectConfig = productConfig.reduce(
          (prev, current) => {
            if (!selectProductConfigList.find(value => value === current.id)) {
              prev.push(current);
            }
            return prev;
          },
          [],
        );
        if (currentProductNoSelectConfig.length) {
          await reportErr(
            `未选择${
              currentProduct.productName
            }中的${currentProductNoSelectConfig
              .map(item => item.categoryName)
              .join(' ')}`,
          );
        }
      }),
    );
  }
}
