/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 15:06:37
 * @LastEditTime: 2020-12-07 18:54:20
 * @FilePath: /koala-server/src/frontend/service/UserService.ts
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { IFrontUserSave } from 'src/global/form/User';
import { FrontUser } from 'src/global/dataobject/User.entity';
import {
  IMyCommentResponseData,
  IPersonalCenterResponseData,
  IUpdateUserPhone,
} from '../interface/IFrontUser';
import { appId } from 'src/config/projectConfig';
import { FrontException } from '../exception/FrontException';
import WXBizDataCrypt from '../../utils/WXBizDataCrypt';
import { reportErr } from 'src/utils/ReportError';
import { BackendException } from 'src/backstage/exception/BackendException';
import { OrderRepository } from 'src/global/repository/OrderRepository';
import { EOrderType } from 'src/global/enums/EOrder';
import { ProductCommentReposiotry } from 'src/global/repository/ProductCommentReposiotry';
import { ProductMainImgRepository } from 'src/global/repository/ProductMainImgRepository';

@Injectable()
export class FrontUserService {
  constructor(
    @InjectRepository(FrontUserRepository)
    private readonly frontUserRepository: FrontUserRepository,
    private readonly orderRepository: OrderRepository,
    private readonly productCommentRepository: ProductCommentReposiotry,
    private readonly productMainImgReposiotry: ProductMainImgRepository,
  ) {}

  // 保存用户
  async save(user: IFrontUserSave): Promise<FrontUser> {
    try {
      const currentUser = await this.findByOpenid(user.openid);

      //判断是否已存在   已存在则是更新用户信息 否则保存
      if (currentUser) {
        try {
          await this.frontUserRepository.update(currentUser.userId, user);
        } catch (e) {
          await reportErr('更新用户信息失败', e);
        }
        return Object.assign({}, currentUser, user);
      } else {
        try {
          return await this.frontUserRepository.save(user);
        } catch (e) {
          await reportErr('登录用户失败', e);
        }
      }
    } catch (e) {
      throw new BackendException(e.message, e);
    }
  }

  // 根据openid查找用户
  async findByOpenid(openid: string): Promise<FrontUser> {
    try {
      const user = await this.frontUserRepository.findByOpenid(openid);
      if (!user) await reportErr('未查到当前用户');
      return user;
    } catch (e) {
      await reportErr(e.message, e);
    }
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

  /**
   * 获取个人中心信息
   * @param openid
   */
  async getPersonalCenterData(
    openid: string,
  ): Promise<IPersonalCenterResponseData> {
    try {
      const { userId } = await this.findByOpenid(openid);
      const db = this.orderRepository.createQueryBuilder('o');
      db.where('o.frontUserUserId =:userId', { userId });
      db.select([
        `count(CASE o.orderType WHEN "${EOrderType.PENDING_PAYMENT}" THEN "${EOrderType.PENDING_PAYMENT}" END) as pendingPayMentNumber`,
        `count(CASE o.orderType WHEN "${EOrderType.TO_BE_DELIVERED}" THEN "${EOrderType.TO_BE_DELIVERED}" END) as toBeDeliveredNumber`,
        `count(CASE o.orderType WHEN "${EOrderType.TO_BE_RECEIVED}" THEN "${EOrderType.TO_BE_RECEIVED}" END) as toBeReceivedNumber`,
        `count(CASE o.orderType WHEN "${EOrderType.COMMENT}" THEN "${EOrderType.COMMENT}" END) as commentNumber`,
      ]);
      try {
        const {
          pendingPayMentNumber,
          toBeDeliveredNumber,
          toBeReceivedNumber,
          commentNumber,
        } = await db.getRawOne<{
          pendingPayMentNumber: string;
          toBeDeliveredNumber: string;
          toBeReceivedNumber: string;
          commentNumber: string;
        }>();

        return {
          orderBtnListData: [
            {
              type: EOrderType.PENDING_PAYMENT,
              badgeNumber: pendingPayMentNumber,
            },
            {
              type: EOrderType.TO_BE_DELIVERED,
              badgeNumber: toBeDeliveredNumber,
            },
            {
              type: EOrderType.TO_BE_RECEIVED,
              badgeNumber: toBeReceivedNumber,
            },
            {
              type: EOrderType.COMMENT,
              badgeNumber: commentNumber,
            },
          ].map(item => ({ ...item, badgeNumber: Number(item.badgeNumber) })),
        };
      } catch (e) {
        await reportErr('获取个人中心信息失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 获取我的评价信息
   * @param page
   * @param openid
   */
  public async getMyComment(
    page: number,
    openid: string,
  ): Promise<IMyCommentResponseData> {
    try {
      const TAKE_NUM = 10;
      const user = await this.findByOpenid(openid);
      try {
        const db = this.productCommentRepository.createQueryBuilder('pc');
        db.leftJoinAndSelect('pc.product', 'pc.product');
        db.andWhere('pc.frontUserUserId =:userId', { userId: user.userId });
        const data = await db
          .skip((page - 1) * TAKE_NUM)
          .take(TAKE_NUM)
          .addOrderBy('pc.createTime', 'DESC')
          .getMany();
        let total = await db.getCount();
        total = Math.ceil(total / TAKE_NUM);

        const productImgList = await this.productMainImgReposiotry.findByIds(
          Array.from(new Set(data.map(item => item.product.productMainImgId))),
        );

        return {
          total,
          list: data.map(
            ({
              id,
              rate,
              text,
              createTime,
              product: { id: productId, productMainImgId },
            }) => ({
              id,
              rate,
              text,
              createTime,
              product: {
                productId,
                url: productImgList.find(v => v.id === productMainImgId).path,
              },
              avatar: user.avatarUrl,
              userName: user.nickName,
            }),
          ),
        };
      } catch (e) {
        await reportErr('获取评价信息失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }
}
