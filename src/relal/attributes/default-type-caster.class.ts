import { Attribute, TypeCasterInterface, UnknownAttribute } from '..';

export class DefaultTypeCaster implements TypeCasterInterface {
  public typeCastForDatabase(): Attribute {
    return new UnknownAttribute();
  }
}
