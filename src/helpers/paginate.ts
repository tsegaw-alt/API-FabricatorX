import { IPaginatedData } from "../interfaces/IPaginatedData";
import { IPaginationOptions } from "../interfaces/IPaginationOptions";

export function paginate<T>(
  data: T[],
  options: IPaginationOptions<T>,
  extractFn: (item: T) => any
): IPaginatedData<T> {
  const {
    page,
    pageSize,
    sortBy,
    sortOrder = "asc",
    filterBy,
    filterFn,
  } = options;

  // Filter the data if filterBy is specified:
  const filteredData = data.filter((item) => {
    return (
      (!filterBy ||
        Object.entries(filterBy).every(
          ([key, value]) => (item as any)[key] === value
        )) &&
      (!filterFn || filterFn(item)) // Use custom filter function if provided
    );
  });

  // Sort the data if sortBy is specified:
  let sortedData = filteredData.slice();
  if (sortBy) {
    sortedData.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }
      return 0;
    });
  }

  // Extract the desired data:
  const extractedData = sortedData.map(extractFn);

  // Calculate the pagination offset and limit:
  const totalCount = extractedData.length;
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const paginatedData = extractedData.slice(offset, offset + limit);

  // Calculate hasPrevious and hasNext:
  const hasPrevious = offset > 0;
  const hasNext = offset + limit < totalCount;

  return { data: paginatedData, totalCount, hasPrevious, hasNext };
}
