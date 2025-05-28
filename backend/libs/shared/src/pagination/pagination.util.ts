export function getPaginationParams(
  page: number,
  limit: number,
): { skip: number; take: number } {
  const skip = (page - 1) * limit;
  const take = limit;
  return { skip, take };
}
