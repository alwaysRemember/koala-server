/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 15:06:10
 * @LastEditTime: 2020-06-23 17:37:10
 * @FilePath: /koala-background-server/src/global/service/FrontUserService.ts
 */

import { IFrontUserSave } from '../form/FrontUser';
import { FrontUser } from '../dataobject/FrontUser.entity';

export interface FrontUserService {
  save(user: IFrontUserSave): Promise<FrontUser>;
  findByOpenid(openid: string): Promise<Array<FrontUser>>;
}
