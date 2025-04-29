import { BaseEntity as BaseEntityInterface } from '@/types';

export abstract class BaseEntity implements BaseEntityInterface {
  public id?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
}
