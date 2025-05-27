const formatCurrency = (amount, currency = 'IDR', locale = 'id-ID') => new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
}).format(amount);

export default formatCurrency;
