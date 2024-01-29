export class PaymentValuesObject {
  static Money(number: number, currency = 'BRL', locale = 'pt-BR') {
    const roundedNumber = parseFloat(Number(!isNaN(number) ? number : 0).toFixed(2));
    const formattedNumber = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(roundedNumber);

    return formattedNumber;
  }
}
