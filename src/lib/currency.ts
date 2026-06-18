export async function fetchExchangeRates(customUsd?: number | null, customRub?: number | null) {
  let usd = customUsd;
  let rub = customRub;

  // Если хотя бы один курс не задан вручную, загружаем из ЦБ РУз
  if (!usd || !rub) {
    try {
      const res = await fetch("https://cbu.uz/ru/arkhiv-kursov-valyut/json/", {
        next: { revalidate: 3600 } // Кэшируем на 1 час
      });
      const data = await res.json();
      
      const usdData = data.find((c: any) => c.Ccy === "USD");
      const rubData = data.find((c: any) => c.Ccy === "RUB");

      if (!usd && usdData) usd = parseFloat(usdData.Rate);
      if (!rub && rubData) rub = parseFloat(rubData.Rate);
    } catch (error) {
      console.error("Failed to fetch exchange rates from CBU:", error);
    }
  }

  return {
    usd: usd || 12500, // Фолбэк на всякий случай
    rub: rub || 140
  };
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: { usd: number, rub: number }
): number {
  if (fromCurrency === toCurrency) return amount;
  
  // 1. Конвертируем из исходной валюты в UZS (базовая расчетная)
  let amountInUzs = amount;
  if (fromCurrency === 'USD') amountInUzs = amount * rates.usd;
  if (fromCurrency === 'RUB') amountInUzs = amount * rates.rub;

  // 2. Конвертируем из UZS в целевую валюту
  if (toCurrency === 'UZS') return amountInUzs;
  if (toCurrency === 'USD') return amountInUzs / rates.usd;
  if (toCurrency === 'RUB') return amountInUzs / rates.rub;

  return amountInUzs;
}
