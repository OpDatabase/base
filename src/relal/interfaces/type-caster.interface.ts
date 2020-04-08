import { Attribute } from '../attributes/attribute.class';

export interface TypeCaster {
  typeCastForDatabase(attributeName: string, value: unknown): Attribute | Promise<Attribute>;
}
