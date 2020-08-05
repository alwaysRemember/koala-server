/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 15:00:38
 * @LastEditTime: 2020-08-05 16:52:15
 * @FilePath: /koala-server/src/global/repository/FrontUserRepository.ts
 */
import { Repository, EntityRepository, Connection } from 'typeorm';
import { FrontUser } from '../dataobject/User.entity';

@EntityRepository(FrontUser)
export class FrontUserRepository extends Repository<FrontUser> {
  constructor(private readonly connection: Connection) {
    super();
  }

  async findByOpenid(openid: string): Promise<FrontUser> {
    return await this.connection.getRepository(FrontUser).findOne({
      where: {
        openid,
      },
    });
  }
}
