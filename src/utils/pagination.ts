export const getPagination = (page: number, size: number) => {
  const pageStartingWithZero = page - 1;
  const limit = size ? +size : 3;
  const from = pageStartingWithZero ? pageStartingWithZero * limit : 0;
  const to = pageStartingWithZero ? from + size - 1 : size - 1;

  return { from, to };
};
