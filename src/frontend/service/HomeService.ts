/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-13 14:45:15
 * @LastEditTime: 2020-08-25 16:29:15
 * @FilePath: /koala-server/src/frontend/service/HomeService.ts
 */

import { Injectable } from '@nestjs/common';
import {
  IHomeData,
  IBannerItem,
  ICategoriesItem,
  IFeaturedItem,
} from '../interface/FrontHome';
import { FrontException } from '../exception/FrontException';
import { reportErr } from 'src/utils/ReportError';
import { AppletHomeBannerRepository } from 'src/global/repository/AppletHomeBannerRepository';
import { CategoriesRepository } from 'src/global/repository/CategoriesRepository';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { ProductMainImg } from 'src/global/dataobject/ProductMainImg.entity';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';

@Injectable()
export class HomeService {
  constructor(
    private readonly bannerRepository: AppletHomeBannerRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly productRepository: ProductRepository,
  ) {}
  async getHomeData(): Promise<IHomeData> {
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
        console.log(bannerList);
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
      // 如不足10个则推荐最新添加的产品
      // TODO 需要根据订单表||产品购买记录进行编写
      try {
        featuredList = await this.productRepository
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
          )
          .orderBy('product.updateTime', 'DESC')
          .take(10)
          .getRawMany();
      } catch (e) {
        await reportErr('获取推荐商品失败', e);
      }

      return { bannerList, categoriesList, showCategoriesMore, featuredList };
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }
}
