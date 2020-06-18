/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:58:59
 * @LastEditTime: 2020-06-18 16:11:03
 * @FilePath: /koala-background-server/src/repository/BackendUserRepository.ts
 */
import {
  Repository,
  EntityRepository,
  Connection,
  UpdateResult,
} from 'typeorm';
import { BackendUser } from 'src/dataobject/BackendUser.entity';

@EntityRepository(BackendUser)
export class BackendUserRepository extends Repository<BackendUser> {
  constructor(private readonly connection: Connection) {
    super();
  }

  /**
   * 根据username查找用户
   * @param param0
   */
  findByUsername(username: string): Promise<BackendUser> {
    return this.connection
      .getRepository(BackendUser)
      .createQueryBuilder()
      .select('user')
      .from(BackendUser, 'user')
      .where('user.username= :username', {
        username,
      })
      .getOne();
  }

  /**
   * 根据用户id修改用户信息
   * @param user
   */
  updateUser(user: BackendUser): Promise<UpdateResult> {
    return this.connection
      .createQueryBuilder()
      .update(BackendUser)
      .set({
        username: user.username,
        password: user.password,
        userType: user.userType,
      })
      .where('userId = :id', { id: user.userId })
      .execute();
  }
}
