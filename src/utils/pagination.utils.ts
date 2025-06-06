import { Opt } from "../types/global.types";

export function getNexPage(currentPage: number, itemPerPage: number, itemTotal: number): Opt<number> {
  const totalPages: number = Math.ceil(itemTotal / itemPerPage);
  if (totalPages && totalPages > currentPage) {
    return currentPage + 1;
  }

  return undefined;
}