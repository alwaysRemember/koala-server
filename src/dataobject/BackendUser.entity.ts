/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-01 18:53:23
 * @LastEditTime: 2020-06-01 19:23:53
 * @FilePath: /koala-background-server/src/dataobject/BackendUser.entity.ts
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EBackendUserType } from '../enums/EBackendUserType';

@Entity('tb_backend_user')
export class BackendUser {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column()
  user_type: EBackendUserType;
}
