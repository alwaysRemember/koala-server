/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:52:53
 * @LastEditTime: 2020-08-06 18:12:40
 * @FilePath: /koala-server/src/backstage/service/BackendUserService.ts
 */
import { BackendUserRepository } from 'src/backstage/repository/BackendUserRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { Injectable } from '@nestjs/common';
import { BackendException } from 'src/backstage/exception/backendException';
import {
  IBackendUserForm,
  IBackendUserLoginForm,
  IBackendUserChangePasswordForm,
  IBackendUserListForm,
} from 'src/backstage/form/BackendUserForm';
import { EbackendFindWithUserType } from 'src/backstage/enums/EBackendUserType';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { reportErr } from 'src/utils/ReportError';
import { IBindAppletUser } from '../interface/IBackendUser';

@Injectable()
export class BackendUserService {
  constructor(
    @InjectRepository(BackendUserRepository)
    private readonly backendUserRepository: BackendUserRepository,
    @InjectRepository(FrontUserRepository)
    private readonly frontUserRepository: FrontUserRepository,
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
      data.password = user.newPassword;

      await this.backendUserRepository.updateUser(data);
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
      let data: BackendUser;
      try {
        data = await this.backendUserRepository.findByUsername(user.username);
      } catch (e) {
        await reportErr('用户查询失败', e);
      }
      // 判断是否存在用户
      if (data) {
        await reportErr('用户名重复，请重新输入');
      }

      // 判断所选小程序用户是否存在
      let appletUser: FrontUser;
      try {
        appletUser = await this.frontUserRepository.findOne(user.appletUserId);
      } catch (e) {
        await reportErr('小程序用户读取失败', e);
      }
      if (!appletUser) {
        await reportErr('所选小程序用户不存在');
      }

      const result = new BackendUser();
      result.appletUserId = user.appletUserId;
      result.email = user.email;
      result.password = user.password;
      result.userType = user.userType;
      result.username = user.username;

      try {
        await this.backendUserRepository.insert(result);
      } catch (e) {
        await reportErr('添加管理员失败', e);
      }
    } catch (e) {
      throw new BackendException(e.message, e);
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
  }: IBackendUserListForm): Promise<{
    list: Array<BackendUser>;
    total: number;
  }> {
    const db = this.backendUserRepository.createQueryBuilder('user');
    db.select([
      'user.userId as userId',
      'user.userType as userType',
      'user.email as email',
      'user.username as username',
      'user.password as password',
      'user.createTime as createTime',
      'user.updateTime as updateTime',
      'appletUser.nickName as appletUserName',
      'appletUser.phone as appletUserPhone',
    ]);
    db.leftJoin(
      FrontUser,
      'appletUser',
      'appletUser.userId = user.appletUserId',
    );

    try {
      // 判断是否有权限条件
      if (username) {
        db.andWhere('user.username Like :username', {
          username: `%${username}%`,
        });
      }
      if (userType !== EbackendFindWithUserType.ALL) {
        db.andWhere('user.userType =:userType', { userType: String(userType) });
      }

      // 分页
      const list = await db
        .skip((page - 1) * number)
        .take(number)
        .addOrderBy('updateTime', 'DESC')
        .getRawMany();
      const total = await db.getCount();
      return { list, total };
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

  /**
   * 根据用户id获取信息
   * @param userId
   */
  async backendFindByUserId(userId: number) {
    try {
      return await this.backendUserRepository.findOne(userId);
    } catch (e) {
      throw new BackendException(e.message);
    }
  }

  /**
   * 关联管理员和小程序用户
   * @param IBindAppletUser
   */
  async bindAppletUser({ userId, appletUserId }: IBindAppletUser) {
    try {
      let user: BackendUser;
      let appletUser: FrontUser;
      try {
        // 查询管理员
        user = await this.backendUserRepository.findOne(userId);
      } catch (e) {
        await reportErr('查询当前选择的后台用户出错', e);
      }
      if (!user) await reportErr('当前选择的后台用户不存在');

      // 判断是否数据无变化
      if (user.appletUserId && user.appletUserId === appletUserId) {
        await reportErr('当前后台用户已绑定了此小程序用户');
      }

      try {
        // 查询小程序用户
        appletUser = await this.frontUserRepository.findOne(appletUserId);
      } catch (e) {
        await reportErr('当前选择的小程序用户出错', e);
      }
      if (!appletUser) await reportErr('当前选择的小程序用户不存在');

      user.appletUserId = appletUser.userId;
      try {
        await this.backendUserRepository.save(user);
      } catch (e) {
        await reportErr('更新后台用户与小程序用户关系出错', e);
      }
    } catch (e) {
      throw new BackendException(e.message, e);
    }
  }
}
