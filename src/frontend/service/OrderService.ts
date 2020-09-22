/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:12:34
 * @LastEditTime: 2020-09-22 19:17:58
 * @FilePath: /koala-server/src/frontend/service/OrderService.ts
 */

import { HttpException, Injectable } from '@nestjs/common';
import { config } from 'rxjs';
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { Order } from 'src/global/dataobject/Order.entity';
import { PayOrder } from 'src/global/dataobject/PayOrder.entity';
import { Product } from 'src/global/dataobject/Product.entity';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { EOrderType } from 'src/global/enums/EOrder';
import { EProductStatus } from 'src/global/enums/EProduct';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { OrderRepository } from 'src/global/repository/OrderRepository';
import { PayOrderRepository } from 'src/global/repository/PayOrderRepository';
import { ProductConfigRepository } from 'src/global/repository/ProductConfigRepository';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { reportErr } from 'src/utils/ReportError';
import { EntityManager, getManager } from 'typeorm';
import { ShoppingAddress } from '../dataobject/ShoppingAddress.entity';
import { FrontException } from '../exception/FrontException';
import { ICreateOrderParams, IOrderItem } from '../form/IFrontOrder';
import { ICreateOrderResponse } from '../interface/IFrontOrder';
import { ShoppingAddressRepository } from '../repository/ShoppingAddressRepository';
import { FrontUserService } from './UserService';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly payOrderRepository: PayOrderRepository,
    private readonly frontUserService: FrontUserService,
    private readonly shoppingAddressRepository: ShoppingAddressRepository,
    private readonly productRepository: ProductRepository,
    private readonly productDetailRepository: ProductDetailRepository,
  ) {}

  /**
   * 创建订单
   * @param data
   */
  async createOrder(data: ICreateOrderParams, openid: string): Promise<void> {
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
      );
      // 创建支付订单记录
      const payOrder = new PayOrder();
      payOrder.orderList = orderList;
      payOrder.payAmount = orderList.reduce(
        (prev, current) => (prev += current.amount),
        0,
      );
      await getManager().transaction(async (entityManager: EntityManager) => {
        await entityManager.save(Order, orderList);
        await entityManager.save(PayOrder, payOrder);
      });
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
            let orderShipping: number = 0; // 运费
            const order = new Order();
            // 订单金额=((商品默认金额+商品配置金额)*商品数量+运费)^n
            const orderAmount = await (
              await Promise.all(
                buyProductList.map(
                  async ({
                    productId,
                    selectProductConfigList,
                    buyQuantity,
                  }) => {
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
                    orderShipping += productDetail.productShipping;
                    // 金额相加
                    return (
                      configAmountList.reduce(
                        (prev, current) => prev + current,
                        productDetail.productAmount,
                      ) *
                        buyQuantity +
                      productDetail.productShipping
                    );
                  },
                ),
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
            order.orderShipping = orderShipping;
            order.remarkList = buyProductList.map(item => ({
              productId: item.productId,
              remark: item.remarks,
            }));
            order.orderType = EOrderType.PENDING_PAYMENT;
            return order;
          },
        ),
    );
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
          value => (value.id = productId),
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
