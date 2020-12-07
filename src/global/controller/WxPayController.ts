/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-18 17:03:30
 * @LastEditTime: 2020-12-07 18:54:30
 * @FilePath: /koala-server/src/global/controller/WxPayController.ts
 */

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { decryptWxNotifyData, transferXmlToJson } from 'src/utils';
import {
  IWxPayNotifyData,
  IWxPayReturnOfGoodsNotifyData,
} from '../interface/IWxPay';
import { WxPayService } from '../service/WxPayService';

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
      return `<xml>
      <return_code><![CDATA[FAIL]]></return_code>
      <return_msg><![CDATA[参数格式校验错误]]></return_msg>
    </xml>`;
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
    try {
      await this.wxPayService.checkOrder(data);
      return `<xml>
      <return_code><![CDATA[SUCCESS]]></return_code>
      <return_msg><![CDATA[OK]]></return_msg>
    </xml>`;
    } catch (e) {
      return `<xml>
      <return_code><![CDATA[FAIL]]></return_code>
      <return_msg><![CDATA[处理结果失败]]></return_msg>
    </xml>`;
    }
  }

  /**
   * 微信退款通知
   */
  @HttpCode(200)
  @Post('/return-of-goods-notify')
  public async returnOfGoodsNotify(@Body() { xml }) {
    for (const key in xml) {
      xml[key] = xml[key][0];
    }
    if (xml['return_code'] !== 'SUCCESS')
      return `<xml>
    <return_code><![CDATA[FAIL]]></return_code>
    <return_msg><![CDATA[参数格式校验错误]]></return_msg>
  </xml>`;
    try {
      const data: IWxPayReturnOfGoodsNotifyData = await decryptWxNotifyData(
        xml.req_info,
      );
      await this.wxPayService.checkReturnOfGoodsOrder(data);
      return `<xml>
      <return_code><![CDATA[SUCCESS]]></return_code>
      <return_msg><![CDATA[OK]]></return_msg>
    </xml>`;
    } catch (e) {
      return `<xml>
      <return_code><![CDATA[FAIL]]></return_code>
      <return_msg><![CDATA[处理结果失败]]></return_msg>
    </xml>`;
    }
  }
}
