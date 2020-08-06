/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 15:06:37
 * @LastEditTime: 2020-08-06 16:19:55
 * @FilePath: /koala-server/src/frontend/service/UserService.ts
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { IFrontUserSave } from 'src/global/form/User';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { IUpdateUserPhone } from '../interface/FrontUser';
import { appId } from 'src/config/projectConfig';
import { FrontException } from '../exception/FrontException';
import WXBizDataCrypt from '../../utils/WXBizDataCrypt';
import { reportErr } from 'src/utils/ReportError';
import { BackendException } from 'src/backstage/exception/backendException';

@Injectable()
export class FrontUserService {
  constructor(
    @InjectRepository(FrontUserRepository)
    private readonly frontUserRepository: FrontUserRepository,
  ) {}

  // 保存用户
  async save(user: IFrontUserSave): Promise<FrontUser> {
    try {
      let currentUser: FrontUser;
      try {
        currentUser = await this.findByOpenid(user.openid);
      } catch (e) {
        await reportErr({ message: '查找用户数据失败', e });
      }

      //判断是否已存在   已存在则是更新用户信息 否则保存
      if (currentUser) {
        try {
          await this.frontUserRepository.update(currentUser.userId, user);
        } catch (e) {
          await reportErr({ message: '更新用户信息失败', e });
        }
        return Object.assign({}, currentUser, user);
      } else {
        try {
          return await this.frontUserRepository.save(user);
        } catch (e) {
          await reportErr({ message: '登录用户失败', e });
        }
      }
    } catch (e) {
      throw new BackendException(e.message, e);
    }
  }

  // 根据openid查找用户
  async findByOpenid(openid: string): Promise<FrontUser> {
    return await this.frontUserRepository.findByOpenid(openid);
  }

  /**
   * 更新用户的手机号
   * @param params
   */
  async updateUserPhone(
    params: IUpdateUserPhone,
    openid: string,
  ): Promise<{ phone: string }> {
    try {
      // 获取用户信息
      const user = await this.findByOpenid(openid);
      if (!user) {
        await reportErr({ message: '不存在当前用户' });
      }

      const pc = new WXBizDataCrypt(appId, user.sessionKey);
      const { purePhoneNumber } = pc.decryptData(
        params.encryptedData,
        params.iv,
      );
      user.phone = purePhoneNumber;
      await this.frontUserRepository.save(user);

      return { phone: purePhoneNumber };
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }
}
