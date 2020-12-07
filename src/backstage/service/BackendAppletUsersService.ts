/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-09 17:37:18
 * @LastEditTime: 2020-12-07 18:51:24
 * @FilePath: /koala-server/src/backstage/service/BackendAppletUsersService.ts
 */
import { Injectable } from '@nestjs/common';
import { IBackendAppletUsersListRequestParams } from 'src/backstage/form/BackendAppletUsersForm';
import { IFrontUser } from 'src/global/form/User';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { BackendException } from 'src/backstage/exception/BackendException';
import { Like } from 'typeorm';
import { FrontUser } from 'src/global/dataobject/User.entity';

@Injectable()
export class BackendAppletUsersService {
  constructor(private readonly frontUserRepository: FrontUserRepository) {}

  /**
   * 获取所有用户
   */
  async getAppletUserAllList(): Promise<Array<IFrontUser>> {
    return await this.frontUserRepository.find();
  }

  /**
   * 获取用户分页信息
   * @param params
   */
  async getAppletUserList({
    page,
    pageSize,
  }: IBackendAppletUsersListRequestParams): Promise<{
    list: Array<IFrontUser>;
    total: number;
  }> {
    try {
      const list = await this.frontUserRepository.find({
        select: [
          'userId',
          'nickName',
          'avatarUrl',
          'gender',
          'country',
          'province',
          'city',
          'phone',
          'createTime',
          'updateTime',
        ],
        order: {
          userId: 'ASC',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      const total = await this.frontUserRepository
        .createQueryBuilder('frontUser')
        .getCount();
      return { list, total };
    } catch (e) {
      throw new BackendException('获取用户列表失败');
    }
  }

  /**
   * 根据手机号获取用户
   * @param phone
   */
  async getUserForPhone(phone: string): Promise<Array<FrontUser>> {
    try {
      return this.frontUserRepository.find({
        select: ['userId', 'phone', 'nickName'],
        where: {
          phone: Like(`${phone}%`),
        },
      });
    } catch (e) {
      throw new BackendException('获取小程序用户失败', e);
    }
  }
}
