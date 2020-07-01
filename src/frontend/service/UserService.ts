/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 15:06:10
 * @LastEditTime: 2020-07-01 18:49:11
 * @FilePath: /koala-background-server/src/frontend/service/UserService.ts
 */

import { IFrontUserSave } from '../../global/form/User';
import { FrontUser } from '../../global/dataobject/User.entity';

export interface FrontUserService {
  save(user: IFrontUserSave): Promise<FrontUser>;
  findByOpenid(openid: string): Promise<Array<FrontUser>>;
}
