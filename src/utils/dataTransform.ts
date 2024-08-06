import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

/**
 * Converts all keys in an object (or array of objects) to camelCase.
 * @param data - The data to be converted.
 * @returns The data with camelCase keys.
 */
export const toCamelCase = (data: any): any => {
  return camelcaseKeys(data, { deep: true });
};

/**
 * Converts all keys in an object (or array of objects) to snake_case.
 * @param data - The data to be converted.
 * @returns The data with snake_case keys.
 */
export const toSnakeCase = (data: any): any => {
  return snakecaseKeys(data, { deep: true });
};
