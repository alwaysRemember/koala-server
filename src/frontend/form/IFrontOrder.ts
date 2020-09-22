/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:29:20
 * @LastEditTime: 2020-09-22 15:31:55
 * @FilePath: /koala-server/src/frontend/form/IFrontOrder.ts
 */
/**
 * 下单接口所需参数
 */
export interface ICreateOrderParams {
  buyProductList: Array<IOrderItem>;
  addressId: number;
}

/**
 * 下单产品参数
 */
export interface IOrderItem {
    productId: string;
    buyQuantity: number; // 购买数量
    selectProductConfigList: Array<number>;
    remarks: string;
  }
  
