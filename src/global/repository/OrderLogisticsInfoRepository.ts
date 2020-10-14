import { EntityRepository, Repository } from 'typeorm';
import { OrderLogisticsInfo } from '../dataobject/OrderLogisticsInfo.entity';

@EntityRepository(OrderLogisticsInfo)
export class OrderLogisticsInfoRepository extends Repository<
  OrderLogisticsInfo
> {}
