export function reorderBy(items, order, getKey = (item) => item) {
  const rank = new Map(order.map((value, index) => [value, index]));

  items.sort((a, b) => {
    const rankA = rank.get(getKey(a));
    const rankB = rank.get(getKey(b));

    if (rankA === undefined && rankB === undefined) return 0;
    if (rankA === undefined) return 1;
    if (rankB === undefined) return -1;
    return rankA - rankB;
  });

  return items;
}
