/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 18:22:25
 * @LastEditTime: 2020-10-13 14:27:02
 * @FilePath: /koala-server/src/utils/Mail.ts
 */

import * as nodemailer from 'nodemailer';
import { SaveLogUtil } from './SaveLogUtil';

export class Mail {
  private transporter;
  private mailOptions;
  private sendUser: string = 'thj740905172@163.com';
  constructor(
    title: string,
    data: object,
    toEmail: string = '740905172@qq.com',
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.163.com',
      port: 465,
      secureConnection: true,
      auth: {
        user: this.send,
        pass: 'QUHINJCPLBMMUTBN',
      },
    });

    var sendHtml = Object.keys(data).reduce(
      (prev: string, current: string) =>
        `${prev} <p>${current} = ${data[current]}</p>`,
      '',
    );

    this.mailOptions = {
      from: `"KOALA - SYSTEM" <${this.send}>`,
      to: toEmail,
      subject: title,
      html: `<div>${sendHtml}</div>`,
    };
  }

  send() {
    this.transporter.sendMail(this.mailOptions, error => {
      if (error) {
        new SaveLogUtil({
          title: '邮件发送错误',
          msg: error.message,
          origin:JSON.stringify(error)
        }).saveError();
      }
    });
  }
}
