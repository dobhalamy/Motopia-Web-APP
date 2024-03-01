export const formatMoneyAmount = amount => `$ ${parseInt(amount, 10).toLocaleString('US')}`;

export const formatNumber = number => parseInt(number, 10).toLocaleString('US');
