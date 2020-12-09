/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-13 14:45:15
 * @LastEditTime: 2020-12-09 15:34:40
 * @FilePath: /koala-server/src/frontend/service/HomeService.ts
 */

import { Injectable } from '@nestjs/common';
import {
  IHomeData,
  IBannerItem,
  ICategoriesItem,
  IFeaturedItem,
} from '../interface/IFrontHome';
import { FrontException } from '../exception/FrontException';
import { reportErr } from 'src/utils/ReportError';
import { AppletHomeBannerRepository } from 'src/global/repository/AppletHomeBannerRepository';
import { CategoriesRepository } from 'src/global/repository/CategoriesRepository';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { ProductMainImg } from 'src/global/dataobject/ProductMainImg.entity';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { Order } from 'src/global/dataobject/Order.entity';
import { Product } from 'src/global/dataobject/Product.entity';
import { EProductStatus } from 'src/global/enums/EProduct';

@Injectable()
export class HomeService {
  constructor(
    private readonly bannerRepository: AppletHomeBannerRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: FrontUserRepository,
  ) {}

  async getHomeData(openid: string): Promise<IHomeData> {
    let bannerList: Array<IBannerItem> = [];
    let categoriesList: Array<ICategoriesItem> = [];
    let showCategoriesMore: boolean = false;
    let featuredList: Array<IFeaturedItem> = [];
    try {
      // 获取banner
      try {
        bannerList = (
          await this.bannerRepository.find({
            select: ['id', 'type'],
            join: {
              alias: 'banner',
              leftJoinAndSelect: {
                bannerImg: 'banner.bannerImg',
                product: 'banner.product',
              },
            },
          })
        ).map(({ id, type, product, bannerImg: { path: imgUrl } }) => ({
          id,
          type,
          imgUrl,
          productId: product.id,
        }));
      } catch (e) {
        await reportErr('获取banner失败', e);
      }
      // 获取标签列表
      // 规则: 当前使用的标签>显示在主页的标签，则需要显示更多选项
      try {
        // 获取使用中的标签
        const totalUseLength: number = await this.categoriesRepository
          .createQueryBuilder('categories')
          .where('categories.isUse=1')
          .getCount();

        categoriesList = await this.categoriesRepository.find({
          select: ['id', 'categoriesIconUrl', 'categoriesName'],
          where: {
            isUse: true,
            isShowOnHome: true,
          },
        });
        showCategoriesMore = totalUseLength > categoriesList.length;
      } catch (e) {
        await reportErr('获取产品标签失败', e);
      }

      // 精选推荐
      // 规则: 根据用户最近购买的产品分类情况进行推荐。
      // 如没有购买的产品则显示卖的最好的产品前10个
      try {
        // 获取当前用户的订单中购买的产品类别
        const categoriesList = await this.categoriesRepository
          .createQueryBuilder('c')
          .leftJoin(FrontUser, 'u', 'u.openid=:openid', { openid })
          .leftJoin(
            Order,
            'o',
            "(o.orderType = 'COMMENT' OR o.orderType = 'FINISHED')",
          )
          .leftJoin(
            'tb_product_related_tb_order',
            'pro',
            'pro.tbOrderId = o.id',
          )
          .leftJoin(Product, 'p', 'p.id = pro.tbProductId')
          .where('c.isUse = 1 AND c.id = p.categoriesId')
          .orderBy('o.createTime', 'DESC')
          .getMany();
        const db = this.productRepository
          .createQueryBuilder('product')
          .select([
            'product.id as id ',
            'product.productName as name',
            'productMainImg.path as logo',
            'detail.productBrief as introduction',
            'detail.productAmount as amount',
          ])
          .leftJoin(
            ProductMainImg,
            'productMainImg',
            'productMainImg.id=product.productMainImgId',
          )
          .leftJoin(
            ProductDetail,
            'detail',
            'detail.id = product.productDetailId',
          );
        // 判断是否有当前购买的分类
        if (categoriesList.length) {
          let str = categoriesList.reduce((prev, current, index) => {
            const isLast = index === categoriesList.length - 1;
            if (index === 0) {
              prev += '(';
            }
            prev += `product.categoriesId='${current.id}'${
              isLast ? '' : 'OR '
            }`;
            if (isLast) prev += ')';
            return prev;
          }, ``);
          db.where(str);
        }
        db.andWhere(`product.productStatus = '${EProductStatus.PUT_ON_SHELF}'`);
        
        db.orderBy('product.createTime', 'DESC');
        db.take(10);
        featuredList = await db.getRawMany();
      } catch (e) {
        await reportErr('获取推荐商品失败', e);
      }

      return { bannerList, categoriesList, showCategoriesMore, featuredList };
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }
}
