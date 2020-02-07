import { QueryParserException } from '../query-parser.exception';

export class MissingPlaceholderException extends QueryParserException {
  constructor(query: string, placeholderName: string) {
    super(`Cannot evaluate query [${query}]: Placeholder $${placeholderName} does not exist in given placeholders. Please ensure that property "${placeholderName}" is provided.`);
  }
}
