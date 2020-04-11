import { TypeCasterInterface } from '../interfaces/type-caster.interface';
import { Attribute } from './attribute.class';
import { UnknownAttribute } from './unknown-attribute.class';

export class DefaultTypeCaster implements TypeCasterInterface {
  public typeCastForDatabase(): Attribute {
    return new UnknownAttribute();
  }
}
