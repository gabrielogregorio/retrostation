export const generateUniqueId = (index: number | string = 0) =>
  `${index}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
