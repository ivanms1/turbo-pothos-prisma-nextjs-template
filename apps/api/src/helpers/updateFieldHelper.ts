/**
 * Helper function to return undefined if the value is null or undefined.
 * Otherwise, return the value.
 * @param value
 */
const updateFieldHelper = (value: any) => {
  return value !== null ? value : undefined;
};

export default updateFieldHelper;
