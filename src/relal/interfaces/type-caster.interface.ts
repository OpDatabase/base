import { Attribute } from '../attributes/attribute.class';

export interface TypeCasterInterface {
  typeCastForDatabase(attributeName: string, value: unknown): Attribute | Promise<Attribute>;
}
