/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-13 14:55:54
 * @LastEditTime: 2020-08-13 15:44:01
 * @FilePath: /koala-server/src/frontend/interface/FrontHome.ts
 */

import { EAppletHomeBannerTypeEnum } from 'src/global/enums/EAppletHomeBanner';

export interface IHomeData {
  bannerList: Array<IBannerItem>;
  categoriesList: Array<ICategoriesItem>;
  showCategoriesMore: boolean; // 是否显示分类的更多选项
  featuredList: Array<IFeaturedItem>;
}

export interface IBannerItem {
  id: number;
  imgUrl: string;
  type: EAppletHomeBannerTypeEnum;
}

// 分类
export interface ICategoriesItem {
  id: string;
  categoriesName: string;
  categoriesIconUrl: string;
}

// 精选推荐
export interface IFeaturedItem {
  id: string;
  logo: string;
  name: string;
  introduction: string;
  amount: number;
}
