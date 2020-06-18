/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:52:53
 * @LastEditTime: 2020-06-18 18:14:29
 * @FilePath: /koala-background-server/src/service/impl/BackendUserServiceImpl.ts
 */
import { BackendUserService } from '../BackendUserService';
import { BackendUserRepository } from 'src/backstage/repository/BackendUserRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { Injectable } from '@nestjs/common';
import { BackendException } from 'src/exception/backendException';
import {
  IBackendUserForm,
  IBackendUserLoginForm,
  IBackendUserChangePasswordForm,
  IBackendUserListForm,
} from 'src/backstage/form/BackendUserForm';
import { EbackendFindWithUserType } from 'src/backstage/enums/EBackendUserType';
import { FindManyOptions, Like } from 'typeorm';
import { RedisCacheServiceImpl } from './RedisCacheServiceImpl';

@Injectable()
export class BackendUserServiceImpl implements BackendUserService {
  constructor(
    @InjectRepository(BackendUserRepository)
    private readonly backendUserRepository: BackendUserRepository,
    private readonly redisService: RedisCacheServiceImpl,
  ) {}

  /**
   * 后台登录接口
   * @param user
   */
  async backendLogin(user: IBackendUserLoginForm): Promise<BackendUser> {
    let data: BackendUser;
    try {
      data = await this.backendUserRepository.findByUsername(user.username);
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

  /**
   * 修改密码
   * @param user
   */
  async backendChangePassword(user: IBackendUserChangePasswordForm) {
    try {
      // 根据用户名和密码查询出用户
      const data: BackendUser = await this.backendLogin({
        username: user.username,
        password: user.oldPassword,
      });

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
          data.userId,
          user.username,
          user.newPassword,
          data.userType,
        ),
      );
    } catch (e) {
      throw new BackendException(e.message);
    }
  }

  /**
   * 添加管理员
   * @param user
   */
  async backendAddUser(user: IBackendUserForm) {
    try {
      const data: BackendUser = await this.backendUserRepository.findByUsername(
        user.username,
      );
      // 判断是否存在用户
      if (data) {
        throw new BackendException('用户名重复，请重新输入');
      }
      await this.backendUserRepository.insert(user);
    } catch (e) {
      throw new BackendException(e.message);
    }
  }

  /**
   * 用户列表
   * @param params
   */
  async backendFindUserListWithParams({
    username,
    userType,
    number,
    page,
  }: IBackendUserListForm): Promise<Array<BackendUser>> {
    const defautParams: FindManyOptions<BackendUser> = {
      select: [
        'username',
        'userType',
        'userId',
        'password',
        'createTime',
        'updateTime',
      ],
      order: {
        userId: 'ASC',
      },
      skip: (page - 1) * number,
      take: number,
    };

    try {
      // 判断搜索条件是否存在
      if (!username && userType === EbackendFindWithUserType.ALL) {
        // 直接查询
        return await this.backendUserRepository.find(defautParams);
      }
      return await this.backendUserRepository.find(
        Object.assign({}, defautParams, {
          where: (userType !== EbackendFindWithUserType.ALL && {
            username: Like(`%${username}%`),
            userType,
          }) || { username: Like(`%${username}%`) },
        }),
      );
    } catch (e) {
      throw new BackendException(e.message);
    }
  }

  // 查询管理员列表所有数据
  async backendFindUserList(): Promise<Array<BackendUser>> {
    try {
      return await this.backendUserRepository.find();
    } catch (e) {
      throw new BackendException(e.message);
    }
  }

  // 修改管理员信息
  async backendUpdateAdminUser(user: BackendUser) {
    try {
      const data: BackendUser = await this.backendUserRepository.findOne(
        user.userId,
      );
      if (!data) {
        throw new BackendException('未查到此用户，请检查用户是否存在');
      }

      await this.backendUserRepository.update(user.userId, user);
    } catch (e) {
      throw new BackendException(e.message);
    }
  }

  // 删除管理员
  async backendDeleteAdminUser(userId: number) {
    try {
      const data: BackendUser = await this.backendUserRepository.findOne(
        userId,
      );
      if (!data) {
        throw new BackendException('用户不存在');
      }
      await this.backendUserRepository.remove(data);
    } catch (e) {
      throw new BackendException(e.message);
    }
  }
}
