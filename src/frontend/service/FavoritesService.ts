/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:29:24
 * @LastEditTime: 2020-11-11 15:48:57
 * @FilePath: /koala-server/src/frontend/service/FavoritesService.ts
 */

import { Injectable } from '@nestjs/common';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { reportErr } from 'src/utils/ReportError';
import { getManager } from 'typeorm';
import { FrontException } from '../exception/FrontException';

@Injectable()
export class FavoritesService {
  constructor(private readonly userRepository: FrontUserRepository) {}

  async getFavoritesData(page: number, openid: string) {
    const TAKE_NUM = 10;
    try {
      let user: FrontUser;
      // 获取用户信息
      try {
        user = await this.userRepository.findOne({
          where: {
            openid,
          },
        });
      } catch (e) {
        await reportErr('获取用户信息失败', e);
      }
      if (!user) await reportErr('用户不存在');
      // 获取分页信息
      try {
        const db = getManager().create('');
        
      } catch (e) {}
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }
}
