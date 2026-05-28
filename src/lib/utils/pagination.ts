export const PRODUCTS_PER_PAGE = 12;

export function getSkipForPage(page: number, limit = PRODUCTS_PER_PAGE) {
  return (Math.max(page, 1) - 1) * limit;
}

export function getTotalPages(total: number, limit = PRODUCTS_PER_PAGE) {
  return Math.max(Math.ceil(total / limit), 1);
}

export function normalizePage(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number(rawValue);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}
