import { Attribute } from '..';

export interface TypeCasterInterface {
  typeCastForDatabase(attributeName: string, value: unknown): Attribute | Promise<Attribute>;
}
