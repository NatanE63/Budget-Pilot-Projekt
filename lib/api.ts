
export const CURRENCIES = [
  { code: 'PLN', name: 'Polski Złoty' },
  { code: 'EUR', name: 'Euro' },
  { code: 'USD', name: 'Dolar Amerykański' },
  { code: 'GBP', name: 'Funt Brytyjski' },
  { code: 'CHF', name: 'Frank Szwajcarski' },
  { code: 'CZK', name: 'Korona Czeska' },
  { code: 'NOK', name: 'Korona Norweska' },
  { code: 'SEK', name: 'Korona Szwedzka' },
  { code: 'HUF', name: 'Forint Węgierski' },
];

export interface ExchangeRateResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export const fetchExchangeRate = async (
  from: string,
  to: string,
  amount: number = 1,
  date?: string
): Promise<number | null> => {
  if (from === to) return 1;
  
  try {
    const url = date 
      ? `https://api.frankfurter.app/${date}?from=${from}&to=${to}&amount=${amount}`
      : `https://api.frankfurter.app/latest?from=${from}&to=${to}&amount=${amount}`;

    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch rates: ${response.statusText}`);
    }

    const data: ExchangeRateResponse = await response.json();
    return data.rates[to] || null;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
};

export const convertAmount = async (
    amount: number,
    from: string,
    to: string,
    date?: string
): Promise<number | null> => {
    const rate = await fetchExchangeRate(from, to, amount, date);
    return rate ? rate : null;
}
  