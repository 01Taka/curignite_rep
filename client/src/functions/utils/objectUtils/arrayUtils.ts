export const isValueInArray = <T, U extends readonly T[]>(value: T, array: U): boolean => {
  return array.includes(value);
};