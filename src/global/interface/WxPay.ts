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
