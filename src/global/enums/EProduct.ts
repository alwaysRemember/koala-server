/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-13 15:39:01
 * @LastEditTime: 2020-08-04 16:42:39
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
