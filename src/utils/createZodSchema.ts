import { z } from 'zod';
export function createZodSchema<T>() {
  return <S extends z.ZodType<T, any, any>>(schema: S) => schema;
}
