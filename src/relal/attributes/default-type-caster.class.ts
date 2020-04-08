import { TypeCaster } from '../interfaces/type-caster.interface';
import { Attribute } from './attribute.class';
import { UnknownAttribute } from './unknown-attribute.class';

export class DefaultTypeCaster implements TypeCaster {
  public typeCastForDatabase(): Attribute {
    return new UnknownAttribute();
  }
}
