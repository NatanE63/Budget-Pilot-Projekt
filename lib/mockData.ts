import { Expense, Category, CATEGORIES } from "../types";
import { CURRENCIES, fetchExchangeRate } from "./api";

const getRandomElement = <T>(arr: readonly T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const getRandomAmount = (min: number, max: number): number => {
  return Number((Math.random() * (max - min) + min).toFixed(2));
};

const getRandomDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().split("T")[0];
};

export const generateRandomExpense = async (baseCurrency: string): Promise<Expense> => {
  const category = getRandomElement(CATEGORIES) as Category;
  const currencyObj = getRandomElement(CURRENCIES);
  const transactionCurrency = currencyObj.code;
  
  // Random date
  const date = getRandomDate(30);

  // Random amount in transaction currency
  const originalAmount = getRandomAmount(10, 500);
  
  let amount = originalAmount;
  let exchangeRate: number | undefined = undefined;

  // Calculate base amount if currencies differ
  if (transactionCurrency !== baseCurrency) {
    const rate = await fetchExchangeRate(transactionCurrency, baseCurrency, 1, date);
    if (rate) {
      exchangeRate = rate;
      amount = originalAmount * rate;
    } else {
       console.error("Failed to fetch rate for random expense");
    }
  }

  const locations: Record<string, string[]> = {
    PLN: ["Warszawa, Polska", "Kraków, Rynek", "Gdańsk, Starówka", "Wrocław, Rynek", "Zakopane, Krupówki"],
    EUR: ["Berlin, Niemcy", "Paryż, Francja", "Rzym, Włochy", "Madryt, Hiszpania", "Wiedeń, Austria", "Barcelona, Hiszpania"],
    USD: ["Nowy Jork, USA", "Los Angeles, USA", "Chicago, USA", "Miami, USA", "Las Vegas, USA"],
    GBP: ["Londyn, UK", "Manchester, UK", "Liverpool, UK", "Edinburgh, Szkocja"],
    CHF: ["Zurych, Szwajcaria", "Genewa, Szwajcaria", "Bern, Szwajcaria"],
    CZK: ["Praga, Czechy", "Brno, Czechy", "Ostrawa, Czechy"],
    NOK: ["Oslo, Norwegia", "Bergen, Norwegia"],
    SEK: ["Sztokholm, Szwecja", "Goteborg, Szwecja"],
    HUF: ["Budapeszt, Węgry", "Debreczyn, Węgry"],
  };

  const descriptions: Record<Category, string[]> = {
    "Restauracje": ["Pyszny obiad z rodziną.", "Szybki lunch w przerwie.", "Romantyczna kolacja.", "Degustacja lokalnych specjałów.", "Kawa i deser."],
    "Atrakcje": ["Zwiedzanie zabytków.", "Bilet wstępu.", "Wycieczka z przewodnikiem.", "Wejście do muzeum.", "Wypożyczenie rowerów."],
    "Transport": ["Przejazd taksówką.", "Bilet na komunikację miejską.", "Tankowanie samochodu.", "Bilet na pociąg.", "Opłata za autostradę."],
    "Nocleg": ["Rezerwacja hotelu.", "Opłata za nocleg Airbnb.", "Opłata klimatyczna.", "Hostel w centrum."],
    "Zakupy": ["Zakupy spożywcze na weekend.", "Nowe ubrania.", "Pamiątki z podróży.", "Prezenty dla rodziny.", "Lokalne produkty."],
    "Inne": ["Usługa fryzjerska.", "Prezent urodzinowy.", "Naprawa telefonu.", "Inne drobne wydatki."]
  };

  const titles: Record<Category, string[]> = {
    "Restauracje": ["Lunch na mieście", "Kawa i ciasto", "Kolacja ze znajomymi", "Pizza night", "Sushi Bar"],
    "Atrakcje": ["Bilet do muzeum", "Kino", "Wejściówka do parku", "Aquapark", "Koncert"],
    "Transport": ["Uber", "Bilet autobusowy", "Paliwo", "Pociąg Intercity", "Bolt"],
    "Nocleg": ["Hotel Mercury", "Apartament Airbnb", "Hostel Centrum", "Camping"],
    "Zakupy": ["Supermarket", "Galeria Handlowa", "Sklep z pamiątkami", "Drogeria", "Targowisko"],
    "Inne": ["Fryzjer", "Kwiaciarnia", "Apteka", "Kiosk"]
  };

  const title = getRandomElement(titles[category] || ["Losowy wydatek"]);

  return {
    id: Math.random().toString(36).substring(2, 9),
    title,
    amount, // In base currency
    date,
    category,
    location: getRandomElement(locations[transactionCurrency] || ["Nieznana lokalizacja"]),
    description: getRandomElement(descriptions[category]),
    originalAmount: transactionCurrency !== baseCurrency ? originalAmount : undefined,
    originalCurrency: transactionCurrency !== baseCurrency ? transactionCurrency : undefined,
    exchangeRate
  };
};
