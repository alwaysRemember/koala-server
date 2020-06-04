/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:58:59
 * @LastEditTime: 2020-06-04 19:08:18
 * @FilePath: /koala-background-server/src/repository/BackendUserRepository.ts
 */
import { Repository, EntityRepository, Connection } from 'typeorm';
import { BackendUser } from 'src/dataobject/BackendUser.entity';
import { BackendUserLoginForm } from 'src/form/BackendUserLoginForm';

@EntityRepository(BackendUser)
export class BackendUserRepository extends Repository<BackendUser> {
  constructor(private readonly connection: Connection) {
    super();
  }

  /**
   * 根据username查找用户
   * @param param0
   */
  findByUsername({
    username,
    password,
  }: BackendUserLoginForm): Promise<BackendUser> {
    return this.connection
      .getRepository(BackendUser)
      .createQueryBuilder()
      .select('user')
      .from(BackendUser, 'user')
      .where('user.username= :username AND user.password= :password', {
        username,
        password,
      })
      .getOne();
  }
}
