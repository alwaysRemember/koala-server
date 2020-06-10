/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:58:59
 * @LastEditTime: 2020-06-10 15:09:41
 * @FilePath: /koala-background-server/src/repository/BackendUserRepository.ts
 */
import {
  Repository,
  EntityRepository,
  Connection,
  UpdateResult,
} from 'typeorm';
import { BackendUser } from 'src/dataobject/BackendUser.entity';
import { BackendUserLoginForm } from 'src/form/BackendUserLoginForm';
import { BackendUserForm } from 'src/form/BackendUserForm';

@EntityRepository(BackendUser)
export class BackendUserRepository extends Repository<BackendUser> {
  constructor(private readonly connection: Connection) {
    super();
  }

  /**
   * 根据username查找用户
   * @param param0
   */
  findByUsername({ username }: BackendUserLoginForm): Promise<BackendUser> {
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
        user_type: user.user_type,
      })
      .where('user_id = :id', { id: user.user_id })
      .execute();
  }
}
