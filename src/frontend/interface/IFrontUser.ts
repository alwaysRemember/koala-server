/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-05 15:25:37
 * @LastEditTime: 2020-11-13 15:37:35
 * @FilePath: /koala-server/src/frontend/interface/IFrontUser.ts
 */

import { EOrderType } from "src/global/enums/EOrder";

export interface IUpdateUserPhone {
  iv: string;
  encryptedData: string;
}
export interface IDefaultOrderBtnItem {
  type: EOrderType;
  badgeNumber: number;
}

export interface IPersonalCenterResponseData {
  orderBtnListData: Array<IDefaultOrderBtnItem>;
}


export interface IMyCommentResponseData {
  total: number;
  list: Array<ICommentItem>;
}

export interface ICommentItem {
  rate: number;
  text: string;
  avatar: string;
  createTime: string;
  product: ICommentProduct;
}

export interface ICommentProduct {
  productId: string;
  url: string;
}