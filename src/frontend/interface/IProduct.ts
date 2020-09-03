import { EProductStatus } from 'src/global/enums/EProduct';

/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-20 15:34:38
 * @LastEditTime: 2020-09-03 15:13:22
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
  productShipping: number;
  productFavorites: boolean; // 收藏状态
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
