/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:52:53
 * @LastEditTime: 2020-06-10 15:12:26
 * @FilePath: /koala-background-server/src/service/impl/BackendUserServiceImpl.ts
 */
import { BackendUserService } from '../BackendUserService';
import { BackendUserLoginForm } from '../../form/BackendUserLoginForm';
import { BackendUserRepository } from 'src/repository/BackendUserRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { BackendUser } from 'src/dataobject/BackendUser.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BackendException } from 'src/exception/backendException';
import { BackendUserChangePassword } from 'src/form/BackendUserChangePassword';
import { UpdateResult } from 'typeorm';

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
        if (data.password === user.password) {
          return data;
        }
        throw new BackendException('用户密码错误,请检查重新输入');
      } else {
        throw new BackendException('不存在此用户,请检查重新输入');
      }
    } catch (e) {
      throw new BackendException(e.message);
    }
  }

  async backendChangePassword(user: BackendUserChangePassword) {
    try {
      const a = new BackendUserLoginForm(user.username, user.oldPassword);
      // 根据用户名和密码查询出用户
      const data: BackendUser = await this.backendLogin(a);

      // 判断用户原密码是否符合
      if (data.password !== user.oldPassword) {
        throw new BackendException('用户原密码不正确，请重新输入');
      }

      // 判断用户修改密码是否为原密码
      if (user.oldPassword === user.newPassword) {
        throw new BackendException('新密码与当前密码一致');
      }

      await this.backendUserRepository.updateUser(
        new BackendUser(
          data.user_id,
          user.username,
          user.newPassword,
          data.user_type,
        ),
      );
    } catch (e) {
      throw new BackendException(e.message);
    }
  }
}
