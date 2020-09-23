/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-18 17:03:30
 * @LastEditTime: 2020-09-23 18:50:24
 * @FilePath: /koala-server/src/global/controller/WxPayController.ts
 */

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IWxPayNotifyData } from '../interface/WxPay';
import { WxPayService } from '../service/wxPayService';

@Controller('/wxPay')
export class WxPayController {
  constructor(private readonly wxPayService: WxPayService) {}

  @HttpCode(200)
  @Post('/pay-notify')
  public async payNotify(@Body() { xml }) {
    for (const key in xml) {
      xml[key] = xml[key][0];
    }
    if (xml['result_code'] !== 'SUCCESS' || xml['return_code'] !== 'SUCCESS')
      return;
    const data: IWxPayNotifyData = {
      appId: xml['appid'],
      orderId: xml['attach'],
      bankType: xml['bank_type'],
      cashFee: Number(xml['cash_fee']),
      feeType: xml['fee_type'],
      isSubScribe: xml['is_subscribe'] === 'Y',
      mchId: xml['mch_id'],
      openId: xml['openid'],
      outTradeNo: xml['out_trade_no'],
      timeEnd: xml['time_end'],
      totalFee: Number(xml['total_fee']),
      transactionId: xml['transaction_id'],
    };
    await this.wxPayService.checkOrder(data);
  }
}
