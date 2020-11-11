/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-20 15:58:44
 * @LastEditTime: 2020-11-11 16:35:03
 * @FilePath: /koala-server/src/frontend/service/ProductService.ts
 */

import { Injectable, UseFilters } from '@nestjs/common';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { FrontException } from '../exception/FrontException';
import { reportErr } from 'src/utils/ReportError';
import {
  IProductDetailResponse,
  IFavoriteProductType,
  IGetProductCommentResponseData,
} from '../interface/IProduct';
import { Product } from 'src/global/dataobject/Product.entity';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { ProductMainImgRepository } from 'src/global/repository/ProductMainImgRepository';
import { OrderRepository } from 'src/global/repository/OrderRepository';
import { EOrderType } from 'src/global/enums/EOrder';
import { ProductCommentReposiotry } from 'src/global/repository/ProductCommentReposiotry';
import { UserFavoritseRepository } from 'src/global/repository/UserFavoritesRepository';
import { UserFavorites } from 'src/global/dataobject/UserFavorites.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productDetailRepository: ProductDetailRepository,
    private readonly frontUserRepository: FrontUserRepository,
    private readonly productMainImgRepository: ProductMainImgRepository,
    private readonly orderRepository: OrderRepository,
    private readonly productCommentReposiotry: ProductCommentReposiotry,
    private readonly userFavoritesRepository: UserFavoritseRepository,
  ) {}

  /**
   * 获取产品详情
   * @param productId
   */
  async getProductDetail(
    productId: string,
    openid: string,
  ): Promise<IProductDetailResponse> {
    try {
      const product = await this.productRepository.findOne(productId, {
        join: {
          alias: 'product',
          leftJoinAndSelect: {
            productBanner: 'product.productBanner',
            productVideo: 'product.productVideo',
            productConfigList: 'product.productConfigList',
          },
        },
      });

      if (!product) await reportErr('获取不到当前产品');

      const productDetail = await this.productDetailRepository.findOne(
        product.productDetailId,
      );

      if (!productDetail) await reportErr('获取不到当前商品的详情信息');

      // 是否收藏
      const { favoriteType } = await this._checkFavoriteProduct(
        openid,
        productId,
      );
      let productMainImg: string;
      try {
        productMainImg = await (
          await this.productMainImgRepository.findOne(product.productMainImgId)
        ).path;
      } catch (e) {
        await reportErr('获取商品主图失败', e);
      }

      // 获取销量
      let productSales: number = 0;
      try {
        const db = this.orderRepository
          .createQueryBuilder('o')
          .leftJoin(
            'tb_product_related_tb_order',
            'pro',
            'pro.tbOrderId = o.id',
          )
          .leftJoin(Product, 'p', 'p.id = pro.tbProductId')
          .where('p.id = :productId AND o.orderType = :type', {
            productId: product.id,
            type: EOrderType.FINISHED, // 完结的订单才能计算销量
          });
        productSales = await db.getCount();
      } catch (e) {
        await reportErr('获取销量失败', e);
      }

      const {
        id,
        productVideo,
        productBanner,
        productName,
        productStatus,
        productType,
        productConfigList,
      } = product;
      const {
        productContent,
        productAmount,
        productBrief,
        productDeliveryCity,
        productParameter,
        productShipping,
      } = productDetail;
      return {
        productId: id,
        productVideo: {
          id: productVideo[0].id,
          url: productVideo[0].path,
        },
        productBanner: productBanner.map(({ id, path }) => ({
          id: id,
          url: path,
        })),
        productAmount,
        productName,
        productStatus,
        productType,
        productBrief,
        productContent,
        productParameter,
        productConfigList,
        productDeliveryCity,
        productSales: productSales,
        productShipping,
        productFavorites: favoriteType,
        productMainImg,
      };
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 收藏商品状态
   * @param data
   * @param openid
   */
  async favoriteProduct(
    { productId, favoriteType }: IFavoriteProductType,
    openid: string,
  ): Promise<{ favoriteType: boolean }> {
    try {
      let product: Product;
      // 查询商品
      try {
        product = await this.productRepository.findOne(productId);
      } catch (e) {
        await reportErr('查询不到商品失败', e);
      }
      if (!product) await reportErr('要收藏的商品不存在');

      // 是否已经收藏
      let {
        favoriteType: storedInFavorite,
        user,
      } = await this._checkFavoriteProduct(openid, productId);
      // 判断进行的收藏状态
      if (favoriteType) {
        // 收藏
        // 判断当前产品是否已经被收藏过
        if (storedInFavorite) await reportErr('当前商品已收藏');
        try {
          const userFavorites = new UserFavorites();
          userFavorites.product = product;
          userFavorites.user = user;
          await this.userFavoritesRepository.save(userFavorites);
        } catch (e) {
          await reportErr('修改收藏状态出错', e);
        }
      } else {
        if (!storedInFavorite) await reportErr('当前商品未收藏');
        // 取消收藏
        try {
          const userFavorites = await this.userFavoritesRepository.findOne({
            where: {
              user,
              product,
            },
          });
          await this.userFavoritesRepository.remove(userFavorites);
        } catch (e) {
          await reportErr('修改收藏状态出错', e);
        }
      }
      return {
        favoriteType,
      };
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 判断当前用户是否收藏了当前产品
   * @param openid
   * @param productId
   */
  async _checkFavoriteProduct(
    openid: string,
    productId: string,
  ): Promise<{
    favoriteType: boolean;
    user: FrontUser;
  }> {
    let user: FrontUser;
    let favoriteType: boolean = false;
    try {
      try {
        user = await this.frontUserRepository.findOne({
          join: {
            alias: 'user',
            leftJoinAndSelect: {
              userFavoritesList: 'user.userFavoritesList',
            },
          },
          where: {
            openid,
          },
        });
      } catch (e) {
        await reportErr('查询当前用户失败', e);
      }
      if (!user) await reportErr('当前用户不存在');
      if (user.userFavoritesList.length) {
        const list = await this.userFavoritesRepository.findByIds(
          user.userFavoritesList.map(item => item.id),
          {
            join: {
              alias: 'uf',
              leftJoinAndSelect: {
                product: 'uf.product',
              },
            },
          },
        );
        favoriteType = !!list.find(v => v.product.id === productId);
      }
      return {
        favoriteType,
        user,
      };
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 获取商品评价
   * @param productId
   */
  async getProductComment(
    productId: string,
  ): Promise<IGetProductCommentResponseData> {
    try {
      try {
        const db = this.productCommentReposiotry.createQueryBuilder('pc');
        db.leftJoinAndSelect('pc.frontUser', 'frontUser');
        db.leftJoin('pc.product', 'product');
        db.andWhere('product.id =:productId', { productId });
        const data = await db.getMany();
        return {
          list: data.map(
            ({
              text,
              rate,
              frontUser: { avatarUrl: avatar, nickName: userName },
              createTime,
            }) => ({
              text,
              rate,
              avatar,
              userName,
              createTime,
            }),
          ),
        };
      } catch (e) {
        await reportErr('获取商品评价失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }
}
