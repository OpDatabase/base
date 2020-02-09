import { MissingPlaceholderException, SqlQueryPlaceholders } from '..';

export function resolvePlaceholders(
  statement: string,
  placeholders: SqlQueryPlaceholders = {},
  replacementHandler: (mark: number) => string = defaultReplacementHandler,
) {
  // Transform placeholders to array of values with placeholders $1, $2, $3...
  const transposedPlaceholders: any[] = [];
  const usedPlaceholders: string[] = [];
  const locatedPlaceholders = statement.match(/(\$[\w_]*)/gi) || [];
  let placeholderMark = 1;

  for (const placeholder of locatedPlaceholders) {
    statement = statement.replace(placeholder, replacementHandler(placeholderMark));
    const placeholderName = placeholder.substr(1);
    if (placeholders[placeholderName] === undefined) {
      throw new MissingPlaceholderException(statement, placeholderName);
    }
    transposedPlaceholders.push(placeholders[placeholderName]);
    usedPlaceholders.push(placeholderName);
    placeholderMark++;
  }

  return {
    statement,
    inputPlaceholders: placeholders,
    transposedPlaceholders,
    usedPlaceholders,
  };
}

function defaultReplacementHandler(mark: number): string {
  return `$${mark}`;
}
