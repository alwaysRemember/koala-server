/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-13 15:39:01
 * @LastEditTime: 2020-11-26 14:48:23
 * @FilePath: /koala-server/src/global/enums/EProduct.ts
 */

/**
 * 产品状态
 */
export enum EProductStatus {
  OFF_SHELF = 'OFF_SHELF', // 下架
  UNDER_REVIEW = 'UNDER_REVIEW', // 审核中
  PUT_ON_SHELF = 'PUT_ON_SHELF', // 上架
}

export enum EProductStatusTransfer {
  OFF_SHELF = '下架',
  UNDER_REVIEW = '审核中',
  PUT_ON_SHELF = '上架',
}

export enum EDefaultSelect {
  ALL = 'ALL',
}

// 订单列表排序规则
export enum EProductSortType {
  AMOUNT_ASE = 'AMOUNT_ASE', // 金额从小到大
  AMOUNT_DESC = 'AMOUNT_DESC', // 金额从大到小
  SALES = 'SALES', // 默认销量小到大排序
}
