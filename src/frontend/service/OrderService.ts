/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:12:34
 * @LastEditTime: 2020-11-17 17:03:04
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
import { EOrderTime, EOrderType } from 'src/global/enums/EOrder';
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
  IConfirmOrder,
  ICreateOrderParams,
  IGetOrderListRequestParams,
  IOrderItem,
  IRefundCourierInfo,
  IReturnOfGoodsParams,
  ISearchOrderRequestParams,
  ISubmitOrderCommentRequestParams,
} from '../form/IFrontOrder';
import {
  IBuyProductQuantityItem,
  ICreateOrderResponse,
  IGetLogisticsInfoResponseData,
  IGetOrderDetailResponseData,
  IGetOrderListResponse,
  IProductItem,
  IShoppingAddress,
} from '../interface/IFrontOrder';
import { ShoppingAddressRepository } from '../repository/ShoppingAddressRepository';
import { WxPay } from '../../utils/wxPay';
import { ETradeType } from '../../utils/wxPay/enums';
import { FrontUserService } from './UserService';
import { OrderRefund } from 'src/global/dataobject/OrderRefund.entity';
import { OrderRefundRepository } from 'src/global/repository/OrderRefundRepository';
import { OrderLogisticsInfo } from 'src/global/dataobject/OrderLogisticsInfo.entity';
import { OrderLogisticsInfoRepository } from 'src/global/repository/OrderLogisticsInfoRepository';
import { ProductComment } from 'src/global/dataobject/ProductComment.entity';

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

  private confirmOrderType: Array<EOrderType> = [EOrderType.TO_BE_RECEIVED];

  private wxPay = new WxPay({
    appid: appId,
    mchId,
    tradeType: ETradeType.JSAPI,
  });
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
    private readonly orderRefundRepository: OrderRefundRepository,
    private readonly orderLogisticsInfoRepository: OrderLogisticsInfoRepository,
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

            const {
              timeStamp,
              nonceStr,
              package: pg,
              paySign,
            } = await this.wxPay.createWxPayOrder({
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
        db.leftJoinAndSelect('order.orderRefund', 'orderRefund');
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
              orderCheckTime: item.orderCheckTime,
              orderCheck: item.orderCheck,
              hasRefundCourierInfo: !!item.orderRefund?.trackingNumber,
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

  // 生成支付订单
  async orderPayment(orderId: string): Promise<ICreateOrderResponse> {
    try {
      let order: Order;

      try {
        order = await this.orderRepository.findOne(orderId, {
          join: {
            alias: 'order',
            leftJoinAndSelect: {
              frontUser: 'order.frontUser',
            },
          },
        });
      } catch (e) {
        await reportErr('获取订单信息失败', e);
      }
      if (!order) await reportErr('未查询到当前订单');
      const payOrder = new PayOrder();
      payOrder.frontUser = order.frontUser;
      payOrder.orderList = [order];
      payOrder.payAmount = order.amount;
      const result = await getManager()
        .transaction<ICreateOrderResponse>(
          async (entityManager: EntityManager) => {
            const payOrderResult = await entityManager.save(PayOrder, payOrder);
            const {
              timeStamp,
              nonceStr,
              package: pg,
              paySign,
            } = await this.wxPay.createWxPayOrder({
              body: 'GO购-商品购买',
              amount: payOrder.payAmount,
              orderId: payOrderResult.id,
              openId: order.frontUser.openid,
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
          await reportErr('生成支付订单失败', e);
        });
      return result as ICreateOrderResponse;
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 订单确认收货
   * @param params
   */
  async confirmOrder({ orderId }: IConfirmOrder) {
    try {
      let order: Order;
      try {
        order = await this.orderRepository.findOne(orderId);
      } catch (e) {
        await reportErr('获取订单信息失败', e);
      }
      if (!order) await reportErr('未查询到当前订单');
      if (!this.confirmOrderType.find(v => v === order.orderType))
        await reportErr('当前订单不允许此操作');
      try {
        // 状态改为待评价
        await this.orderRepository.update(order.id, {
          orderType: EOrderType.COMMENT,
        });
      } catch (e) {
        await reportErr('确实收货失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 新增退货快递信息
   * @param params
   */
  async addRefundCourierInfo({
    orderId,
    courierName,
    courierNum,
  }: IRefundCourierInfo) {
    try {
      let order: Order;
      try {
        order = await this.orderRepository.findOne(orderId, {
          join: {
            alias: 'order',
            leftJoinAndSelect: {
              orderRefund: 'order.orderRefund',
            },
          },
        });
      } catch (e) {
        await reportErr('获取订单信息失败', e);
      }
      if (!order) await reportErr('未查到当前订单信息');
      if (order.orderRefund.trackingNumber)
        await reportErr('您已填写过退款快递信息');
      const { id } = order.orderRefund;
      await this.orderRefundRepository.update(id, {
        trackingNumber: courierNum,
        courierName,
      });
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 提交订单评价
   * @param params
   */
  async submitOrderComment(
    { orderId, productList }: ISubmitOrderCommentRequestParams,
    openid: string,
  ) {
    try {
      let order: Order;
      // 获取用户
      const user = await this.frontUserService.findByOpenid(openid);
      try {
        order = await this.orderRepository.findOne(orderId, {
          join: {
            alias: 'order',
            leftJoinAndSelect: {
              productList: 'order.productList',
            },
          },
        });
      } catch (e) {
        await reportErr('订单信息获取失败', e);
      }
      if (!order) await reportErr('当前订单不存在');

      if (order.orderType !== EOrderType.COMMENT)
        await reportErr('当前订单状态不允许此操作');

      if (order.productList.length !== productList.length)
        await reportErr('当前评价订单的商品不正确');

      let { length } = order.productList.reduce((prev, current) => {
        if (productList.find(d => d.productId === current.id)) {
          return prev;
        } else {
          return [...prev, current];
        }
      }, []); // 获取当前订单购买的产品和评价产品不同的产品
      if (length) await reportErr("当前评价订单的商品不正确'");
      await getManager()
        .transaction(async (entityManager: EntityManager) => {
          await entityManager.update(Order, order.id, {
            orderType: EOrderType.FINISHED,
            canCheckOutTime: String(
              new Date().getTime() + EOrderTime.CAN_CHECK_OUT_TIME,
            ),
          });
          // 获取产品
          const productEntityList = await this.productRepository.findByIds(
            productList.map(item => item.productId),
          );
          // 生成评价信息
          const commentList = productList.map(({ rate, productId, text }) => {
            const productComment = new ProductComment();
            productComment.product = productEntityList.find(
              v => v.id === productId,
            );
            productComment.rate = rate;
            productComment.text = text ? text : '系统自动好评';
            productComment.frontUser = user;
            return productComment;
          });
          await entityManager.save(ProductComment, commentList);
          // 修改商品的销量
          await this.updateProductSale(
            order.productList,
            order.buyProductQuantityList,
          );
        })
        .catch(async e => {
          await reportErr('提交评价信息失败', e);
        });
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 更新商品的销量
   * @param productList
   * @param buyProductQuantityList
   */
  async updateProductSale(
    productList: Array<Product>,
    buyProductQuantityList: Array<IBuyProductQuantityItem>,
  ) {
    
    try {
      productList.forEach(async item => {
        await this.productRepository.update(item.id,{
          productSales:item.productSales+buyProductQuantityList.find(v=>v.productId === item.id).buyQuantity
        })
      });
      
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 自动评价
   */
  async autoFinishedOrder() {
    try {
      let orderList = await this.orderRepository.find({
        join: {
          alias: 'order',
          leftJoinAndSelect: {
            frontUser: 'order.frontUser',
            productList: 'order.productList',
          },
        },
        where: {
          orderType: EOrderType.COMMENT,
        },
      });
      orderList = orderList.filter(({ updateTime }) => {
        const middleNumber =
          new Date().getTime() - new Date(updateTime).getTime(); // 当前的时间 - 最后一次更新的时间
        // 大于7天
        return middleNumber >= 604800000;
      });
      orderList.forEach(
        async ({
          frontUser: { openid },
          productList,
          id,
          buyProductQuantityList,
        }) => {
          await getManager().transaction(async () => {
            // 提交商品评价
            await this.submitOrderComment(
              {
                orderId: id,
                productList: productList.map(({ id }) => ({
                  productId: id,
                  rate: 5,
                  text: '系统自动好评',
                })),
              },
              openid,
            );
            // 更新商品销量
            await this.updateProductSale(productList, buyProductQuantityList);
            console.log('end');
          });
        },
      );
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 获取订单详情
   * @param orderId
   */
  async getOrderDetail(orderId: string): Promise<IGetOrderDetailResponseData> {
    try {
      let order: Order;
      try {
        const db = this.orderRepository.createQueryBuilder('order');
        db.leftJoin('order.frontUser', 'frontUser');
        db.leftJoinAndSelect('order.productList', 'productList');
        db.leftJoinAndSelect('order.orderRefund', 'orderRefund');
        db.leftJoinAndSelect('order.payOrder', 'payOrder');
        db.andWhere('order.id =:orderId', { orderId });
        order = await db.getOne();
      } catch (e) {
        await reportErr('获取订单详情失败', e);
      }
      if (!order) await reportErr('当前订单不存在');
      const {
        id,
        orderType,
        amount,
        orderCheckTime,
        orderCheck,
        orderRefund,
        productList,
        orderShopping,
        shoppingAddress,
        remarkList,
        refundRecvAccount,
        refundSuccessTime,
        payOrder,
        buyProductConfigList,
        buyProductQuantityList,
      } = order;
      return {
        orderId: id,
        orderType,
        amount,
        orderCheck,
        orderCheckTime,
        hasRefundCourierInfo: !!orderRefund?.trackingNumber,
        orderShopping,
        shoppingAddress,
        remarkList,
        refundRecvAccount,
        refundSuccessTime,
        transactionId: payOrder.transactionId,
        productList: await Promise.all(
          productList.map(async d => {
            // 提取产品配置的id
            const productConfigIdList = buyProductConfigList?.find(
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
              buyQuantity: buyProductQuantityList.find(
                item => item.productId === d.id,
              ).buyQuantity,
              productConfigList: productConfig.map(i => i.name),
              amount,
              img,
            };
          }),
        ),
      };
    } catch (e) {
      throw new FrontException(e.message);
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
            order.expiration = String(new Date().getTime() + EOrderTime.CANCEL);
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
   * 退货退款
   * @param params
   */
  async returnOfGoods({ orderId, reason }: IReturnOfGoodsParams) {
    try {
      let order: Order;
      try {
        order = await this.orderRepository.findOne(orderId, {
          join: {
            alias: 'order',
            leftJoinAndSelect: {
              backendUser: 'order.backendUser',
              productList: 'order.productList',
            },
          },
        });
      } catch (e) {
        await reportErr('获取订单信息失败', e);
      }
      if (!order) await reportErr('当前退款订单不存在');
      if (this.returnOfGoodsType.indexOf(order.orderType) === -1)
        await reportErr('当前订单状态不允许进行此操作');
      if (order.orderType === EOrderType.REFUNDING)
        await reportErr('当前订单已在退款处理中');

      // 修改订单状态&存储退款记录
      await getManager().transaction(async (entityManager: EntityManager) => {
        const orderRefund = new OrderRefund();
        orderRefund.order = order;
        orderRefund.reason = reason;
        await entityManager.save(orderRefund);
        await entityManager.update(Order, order.id, {
          orderType: EOrderType.REFUNDING,
        });
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
      });
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 获取快递信息
   * @param orderId
   */
  async getLogisticsInfo(
    orderId: string,
  ): Promise<IGetLogisticsInfoResponseData | null> {
    try {
      let logiticsInfo: OrderLogisticsInfo;
      try {
        const db = this.orderLogisticsInfoRepository
          .createQueryBuilder('info')
          .leftJoin(Order, 'order', 'order.id =:id', { id: orderId })
          .andWhere('info.id =order.logisticsInfoId');
        logiticsInfo = await db.getOne();
      } catch (e) {
        await reportErr('查询快递信息失败', e);
      }
      if (logiticsInfo) {
        const { name, num, signStatus, expressData } = logiticsInfo;
        return {
          name,
          num,
          signStatus,
          expressData,
        };
      } else {
        return null;
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 搜索订单
   * @param params
   */
  async searchOrder(
    { page, searchValue }: ISearchOrderRequestParams,
    openid: string,
  ): Promise<IGetOrderListResponse> {
    const TAKE_NUM = 10;
    try {
      // 获取用户
      const user = await this.frontUserService.findByOpenid(openid);
      try {
        const db = this.orderRepository.createQueryBuilder('order');
        db.leftJoin('order.frontUser', 'frontUser');
        db.leftJoinAndSelect('order.productList', 'productList');
        db.leftJoinAndSelect('order.orderRefund', 'orderRefund');
        db.leftJoin(
          'tb_product_related_tb_order',
          'pro',
          'pro.tbOrderId = order.id',
        );
        db.leftJoin(Product, 'product', 'product.id = pro.tbProductId');
        db.andWhere('order.frontUser.userId=:id', { id: user.userId });
        db.andWhere(`product.productName Like :name`, {
          name: `%${searchValue}%`,
        });
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
              orderCheckTime: item.orderCheckTime,
              orderCheck: item.orderCheck,
              hasRefundCourierInfo: !!item.orderRefund?.trackingNumber,
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
