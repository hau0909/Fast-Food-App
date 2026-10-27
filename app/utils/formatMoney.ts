export const formatMoney = (
  price: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  // Xử lý trường hợp đầu vào không hợp lệ
  if (price === null || price === undefined || isNaN(price)) {
    price = 0;
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2, // Luôn hiển thị 2 chữ số sau dấu thập phân
    maximumFractionDigits: 2,
  });

  return formatter.format(price);
};
