const paginate = (array, page_size, page_number) => {
  // Calculate the start and end indices for slicing the array
  const start = (page_number - 1) * page_size;
  const end = start + page_size;

  // Return the sliced array for the current page
  return array.slice(start, end);
};

const getPagination = (totalItems, pageSize, currentPage) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  return {
    totalItems,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

export { paginate, getPagination };