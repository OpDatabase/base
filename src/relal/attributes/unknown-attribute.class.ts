import { UnknownNativeType } from '../interfaces/node-types.interface';
import { Attribute } from './attribute.class';

export class UnknownAttribute extends Attribute {
  public typeCastForDatabase(inputValue: UnknownNativeType): string {
    console.warn(`Type casting for UnknownAttribute "${this.table.name}"."${this.name}"`);

    return `${inputValue}`;
  }
}
