/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 18:22:25
 * @LastEditTime: 2020-06-05 18:48:07
 * @FilePath: /koala-background-server/src/utils/Mail.ts
 */

import * as nodemailer from 'nodemailer';
import { SaveLogUtil } from './SaveLogUtil';

export class Mail {
  private transporter;
  private mailOptions;
  constructor(title: string, data: object) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.163.com',
      port: 465,
      secureConnection: true,
      auth: {
        user: 'thj740905172@163.com',
        pass: 'QUHINJCPLBMMUTBN',
      },
    });

    var sendHtml = Object.keys(data).reduce(
      (prev: string, current: string) =>
        `${prev} <p>${current} = ${data[current]}</p>`,
      '',
    );

    this.mailOptions = {
      from: '"KOALA - SYSTEM" <thj740905172@163.com>',
      to: '740905172@qq.com',
      subject: title,
      html: `<div>${sendHtml}</div`,
    };
  }

  send() {
    this.transporter.sendMail(this.mailOptions, error => {
      if (error) {
        new SaveLogUtil(this.mailOptions).saveError();
      }
    });
  }
}
