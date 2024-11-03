export const formatDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};
