import { Injectable } from '@nestjs/common';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { reportErr } from 'src/utils/ReportError';
import { ShoppingAddress } from '../dataobject/ShoppingAddress.entity';
import { FrontException } from '../exception/FrontException';
import { IAddShoppingAddressParams } from '../form/ShoppingAddress';
import { ShoppingAddressRepository } from '../repository/ShoppingAddressRepository';

/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-14 15:20:30
 * @LastEditTime: 2020-09-14 17:04:03
 * @FilePath: /koala-server/src/frontend/service/ShoppingAddressService.ts
 */
@Injectable()
export class ShoppingAddressService {
  constructor(
    private readonly shoppingAddressRepository: ShoppingAddressRepository,
    private readonly frontUserRepository: FrontUserRepository,
  ) {}

  /**
   * 新增或者修改收货地址
   * @param param0
   */
  async addShoppingAddress(
    {
      id,
      address,
      name,
      phone,
      area,
      isDefaultSelection,
    }: IAddShoppingAddressParams,
    openid: string,
  ) {
    const shoppingAddress = new ShoppingAddress();
    shoppingAddress.address = address;
    shoppingAddress.name = name;
    shoppingAddress.phone = phone;
    shoppingAddress.area = area;
    shoppingAddress.isDefaultSelection = isDefaultSelection;
    if (id) shoppingAddress.id = id;
    try {
      let data: ShoppingAddress;
      try {
        // 查找用户
        const user = await this.frontUserRepository.findByOpenid(openid);

        // 关联用户
        shoppingAddress.appletUser = user;
        await this.shoppingAddressRepository.save(shoppingAddress);
      } catch (e) {
        await reportErr('保存地址失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 获取收货地址列表
   */
  async getShoppingAddressList(
    openid: string,
  ): Promise<Array<ShoppingAddress>> {
    try {
      let list: Array<ShoppingAddress>;
      try {
        let user = await this.frontUserRepository.findByOpenid(openid);
        list = await this.shoppingAddressRepository.find({
          order: {
            updateTime: 'ASC',
          },
          where: {
            appletUser: user,
          },
        });
        return list;
      } catch (e) {
        await reportErr('获取收货地址列表失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }
}
