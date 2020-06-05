/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:52:53
 * @LastEditTime: 2020-06-04 19:25:46
 * @FilePath: /koala-background-server/src/service/impl/BackendUserServiceImpl.ts
 */
import { BackendUserService } from '../BackendUserService';
import { BackendUserLoginForm } from '../../form/BackendUserLoginForm';
import { BackendUserRepository } from 'src/repository/BackendUserRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { BackendUser } from 'src/dataobject/BackendUser.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BackendException } from 'src/exception/backendException';

@Injectable()
export class BackendUserServiceImpl implements BackendUserService {
  constructor(
    @InjectRepository(BackendUserRepository)
    private readonly backendUserRepository: BackendUserRepository,
  ) {}

  /**
   * 后台登录接口
   * @param user
   */
  async backendLogin(user: BackendUserLoginForm): Promise<BackendUser> {
    let data: BackendUser;
    try {
      data = await this.backendUserRepository.findByUsername(user);
      if (data) {
        return data;
      } else {
        throw new BackendException('不存在此用户或密码不正确，请检查重新输入');
      }
    } catch (e) {
      throw new BackendException(e.message);
    }
  }
}
