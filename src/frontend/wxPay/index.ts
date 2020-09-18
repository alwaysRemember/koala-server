/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-18 16:10:52
 * @LastEditTime: 2020-09-18 17:51:36
 * @FilePath: /koala-server/src/frontend/wxPay/index.ts
 */
import { ETradeType } from './enums';
import {
  ICreateWxPayOrderResponse,
  IWxPayOrderParams,
  IWxPayParams,
} from './interface';
import publicIp from 'public-ip';
import { HOST } from 'src/config/FileConfig';
import crypto from 'crypto';
import { FrontException } from '../exception/FrontException';
import Axios from 'axios';
import { reportErr } from 'src/utils/ReportError';

export class WxPay {
  private appid: string;
  private mchId: string;
  private tradeType: ETradeType;
  private notifyUrl: string;
  private terminalIP: string;
  private defaultKey: string = 'xoXNQaLVMD1DusMmpHSi5110r7EyV8I2'; // 默认加密key
  constructor({ appid, mchId, tradeType = ETradeType.JSAPI }: IWxPayParams) {
    this.appid = appid;
    this.mchId = mchId;
    this.tradeType = tradeType;
    this.notifyUrl = `${HOST}/api/wxPay/pay-notify`;
    publicIp.v4().then(value => {
      this.terminalIP = value;
    });
  }

  /**
   * 创建微信支付订单
   * @param param0
   */
  async createWxPayOrder({
    body,
    amount,
    orderId,
  }: IWxPayOrderParams): Promise<ICreateWxPayOrderResponse> {
    const params = {
      appid: this.appid,
      mch_id: this.mchId,
      nonce_str: this.createNoceStr(),
      body,
      out_trade_no: this.createNoceStr(),
      total_fee: amount,
      spbill_create_ip: this.terminalIP,
      notify_url: this.notifyUrl,
      trade_type: this.tradeType,
      product_id: orderId,
    };
    params['sign'] = this.paySign(params);

    try {
      const {
        data: {
          return_code,
          return_msg,
          result_code,
          nonce_str,
          prepay_id,
          sign,
        },
      } = await Axios.post(
        'https://api.mch.weixin.qq.com/pay/unifiedorder',
        params,
      );
      // 通信或者交易非成功的情况
      if (return_code !== 'SUCCESS' || result_code !== 'SUCCESS') {
        await reportErr(return_msg || '生成微信支付订单失败');
      }

      return {
        timeStamp: parseInt(new Date().getTime() / 1000 + ''),
        nonceStr: nonce_str,
        package: `prepay_id=${prepay_id}`,
        paySign: sign,
      };
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 生成随机数
   */
  private createNoceStr(): string {
    return Math.random()
      .toString(36)
      .substr(2, 16);
  }

  /**
   * 字符串排序
   * @param data
   */
  private stringSort(data: { [key: string]: any }): string {
    // 根据首字母重新排序
    data = Object.keys(data)
      .sort()
      .reduce((prev, current) => {
        return Object.assign({}, prev, {
          [current]: data[current],
        });
      }, {});
    let str: string = '';
    for (const key in data) {
      str += `&${key}=${data[key]}`;
    }
    return str;
  }

  /**
   * 生成支付签名
   * @param data
   */
  private paySign(data: { [key: string]: any }): string {
    let str = this.stringSort(data);
    str += `&key=${this.defaultKey}`;
    return crypto
      .createHash('md5')
      .update(str, 'utf8')
      .digest('hex')
      .toUpperCase();
  }
}
