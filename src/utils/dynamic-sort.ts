export const dynamicSort = (data: any[], sortOrder: string): any[] => {
  const [field, direction] = sortOrder.split(" ");
  const dir = direction === "ASC" ? 1 : -1;

  return data.sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];

    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return -1 * dir;
    if (valueB == null) return 1 * dir;

    if (typeof valueA === "number" && typeof valueB === "number") {
      return (valueA - valueB) * dir;
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      return valueA.localeCompare(valueB) * dir;
    }

    return 0;
  });
};
