import { EOrderRefundAccount, EOrderRefundStatus } from '../enums/EOrder';

export interface IWxPayNotifyData {
  appId: string;
  orderId: string;
  bankType: string;
  cashFee: number; // 支付金额
  feeType: string;
  isSubScribe: boolean; // 是否关注公众号
  mchId: string;
  openId: string;
  outTradeNo: string; // 商户订单号
  timeEnd: string; // 付款成功时间
  totalFee: number; // 订单金额
  transactionId: string; // 微信支付订单号
}

export interface IWxPayReturnOfGoodsNotifyData {
  transaction_id: string; // 微信订单号
  out_trade_no: string; // 商户订单号
  refund_id: string; // 微信退款单号
  out_refund_no: string; // 商户退款单号
  total_fee: number; // 订单金额
  settlement_total_fee?: number; // 应结订单金额 只有使用非充值代金券的时候存在此字段
  refund_fee: number; // 申请退款金额
  settlement_refund_fee: number; // 应结退款金额
  refund_status: EOrderRefundStatus; // 退款状态
  success_time: string; // 退款成功时间
  refund_recv_accout: string; // 退款入账账户
  refund_account: EOrderRefundAccount; // 退款资金来源
  
}
