/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 15:06:37
 * @LastEditTime: 2020-08-05 17:15:54
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

@Injectable()
export class FrontUserService {
  constructor(
    @InjectRepository(FrontUserRepository)
    private readonly frontUserRepository: FrontUserRepository,
  ) {}

  // 保存用户
  async save(user: IFrontUserSave): Promise<FrontUser> {
    const currentUser: FrontUser = await this.findByOpenid(user.openid);
    //判断是否已存在   已存在则是更新用户信息 否则保存
    if (currentUser) {
      await this.frontUserRepository.update(currentUser.userId, user);
      return Object.assign({}, currentUser, user);
    } else {
      return await this.frontUserRepository.save(user);
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
    // const pc = new WXBizDataCrypt(appId);

    try {
      // 获取用户信息
      const user = await this.findByOpenid(openid);
      if (!user) {
        Promise.reject({ message: '不存在当前用户' });
      }
      console.log(params);

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
