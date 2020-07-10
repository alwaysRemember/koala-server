/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 15:06:37
 * @LastEditTime: 2020-06-23 18:13:31
 * @FilePath: /koala-background-server/src/global/service/impl/FrontUserServiceImpl.ts
 */
import { FrontUserService } from '../UserService';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { IFrontUserSave } from 'src/global/form/User';
import { FrontUser } from 'src/global/dataobject/User.entity';

@Injectable()
export class FrontUserServiceImpl implements FrontUserService {
  constructor(
    @InjectRepository(FrontUserRepository)
    private readonly frontUserRepository: FrontUserRepository,
  ) {}

  // 保存用户
  async save(user: IFrontUserSave): Promise<FrontUser> {
    const userList: Array<FrontUser> = await this.findByOpenid(user.openid);
    //判断是否已存在   已存在则是更新用户信息 否则保存
    if (userList.length > 0) {
      await this.frontUserRepository.update(userList[0].userId, user);
      return Object.assign({}, userList[0], user);
    } else {
      return await this.frontUserRepository.save(user);
    }
  }

  // 根据openid查找用户
  async findByOpenid(openid: string): Promise<Array<FrontUser>> {
    return await this.frontUserRepository.findByOpenid(openid);
  }
}
