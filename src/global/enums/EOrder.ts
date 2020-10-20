/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-18 18:21:24
 * @LastEditTime: 2020-10-20 16:41:33
 * @FilePath: /koala-server/src/global/enums/EOrder.ts
 */

export enum EOrderType {
  PENDING_PAYMENT = 'PENDING_PAYMENT', // 待付款
  TO_BE_DELIVERED = 'TO_BE_DELIVERED', // 待发货
  TO_BE_RECEIVED = 'TO_BE_RECEIVED', // 待收货
  REFUNDING = 'REFUNDING', // 退款中
  SUCCESS_RETURN = 'SUCCESS_RETURN', // 退款成功
  COMMENT = 'COMMENT', // 待评价
  FINISHED = 'FINISHED', // 已完结
  CANCEL = 'CANCEL', // 已取消
}

export enum EOrderExpiration {
  CANCEL = 7200000, // 自动取消时间(毫秒)
}
