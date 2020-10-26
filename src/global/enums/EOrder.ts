/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-18 18:21:24
 * @LastEditTime: 2020-10-26 17:26:49
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

// 财务状态
export enum EFinancialStatus {
  TO_BE_CHECKED_OUT = 'TO_BE_CHECKED_OUT', //  待结账
  CHECKED_OUT = 'CHECKED_OUT', // 已结账
}

export enum EOrderExpressStatus {
  POLLING = 'polling', // 监控中
  SHUTDOWN = 'shutdown', // 结束
  ABORT = 'abort', // 中止
  UPDATEALL = 'updateall', // 重新推送
}

export enum EOrderExpiration {
  CANCEL = 7200000, // 自动取消时间(毫秒)
}

// 订单退款状态
export enum EOrderRefundStatus {
  NULL = 'NULL',
  SUCCESS = 'SUCCESS', // 退款成功
  REFUNDCLOSE = 'REFUNDCLOSE', // 退款关闭
  PROCESSING = 'PROCESSING', // 退款处理中
  CHANGE = 'CHANGE', // 退款异常
}

// 订单退款资金来源
export enum EOrderRefundAccount {
  NULL = 'NULL', // 未进行退款
  REFUND_SOURCE_RECHARGE_FUNDS = 'REFUND_SOURCE_RECHARGE_FUNDS', // 可用余额退款/基本账户
  REFUND_SOURCE_UNSETTLED_FUNDS = 'REFUND_SOURCE_UNSETTLED_FUNDS', // 未结算资金退款
}
