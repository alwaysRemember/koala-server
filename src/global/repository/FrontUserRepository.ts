/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-23 15:00:38
 * @LastEditTime: 2020-06-23 17:43:33
 * @FilePath: /koala-background-server/src/global/repository/FrontUserRepository.ts
 */
import { Repository, EntityRepository, Connection } from 'typeorm';
import { FrontUser } from '../dataobject/User.entity';

@EntityRepository(FrontUser)
export class FrontUserRepository extends Repository<FrontUser> {
  constructor(private readonly connection: Connection) {
    super();
  }

  async findByOpenid(openid: string): Promise<Array<FrontUser>> {
    return await this.connection.getRepository(FrontUser).find({
      where: {
        openid,
      },
    });
  }
}
