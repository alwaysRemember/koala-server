/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-09 17:37:18
 * @LastEditTime: 2020-07-28 11:56:21
 * @FilePath: /koala-server/src/backstage/service/BackendAppletUsersService.ts
 */
import { Injectable } from '@nestjs/common';
import { IBackendAppletUsersListRequestParams } from 'src/backstage/form/BackendAppletUsersForm';
import { IFrontUser } from 'src/global/form/User';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { BackendException } from 'src/backstage/exception/backendException';

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
}
