import { EProductStatus } from 'src/global/enums/EProduct';

/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-20 15:34:38
 * @LastEditTime: 2020-11-06 15:38:20
 * @FilePath: /koala-server/src/frontend/interface/IProduct.ts
 */
export interface IProductDetailResponse {
  productId: string;
  productVideo: IProductDetailVideo;
  productBanner: Array<IProductDetailBanner>;
  productAmount: number;
  productName: string;
  productStatus: EProductStatus;
  productType: boolean; // 是否为7天无理由退款商品
  productBrief: string; // 产品简介
  productContent: string; // 产品内容介绍
  productParameter: Array<{ key: string; value: string }>; // 产品参数
  productConfigList: Array<IProductConfig>;
  productDeliveryCity: string; // 发货地点
  productSales: number; // 销量
  productShipping: number; // 产品运费
  productFavorites: boolean; // 收藏状态
  productMainImg: string; // 产品主图
}

// 产品配置
export interface IProductConfig {
  id: number;
  categoryName: string; // 分类名称
  name: string; // 配置项名称
  amount: number;
}

export interface IProductDetailFile {
  id: string;
  url: string;
}
export interface IProductDetailVideo extends IProductDetailFile {}

export interface IProductDetailBanner extends IProductDetailFile {}

// 收藏商品
export interface IFavoriteProductType {
  productId: string;
  favoriteType: boolean; // 收藏状态  T 收藏  F 取消收藏
}

export interface IGetProductCommentResponseData {
  list: Array<IProductCommentItem>;
}
export interface IProductCommentItem {
  text: string;
  rate: number;
  likeNumber: number;
  avatar: string;
}
