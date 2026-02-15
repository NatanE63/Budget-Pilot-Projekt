# Wymagania Projektowe - Mapowanie Implementacji

Poniżej znajduje się lista wymagań projektowych wraz z ich lokalizacją w kodzie źródłowym.

## 1. TailwindCSS

| Wymaganie | Plik | Opis / Lokalizacja |
|-----------|------|--------------------|
| **Użycie media query** | `components/EventCard.tsx` | Użycie prefixów responsywnych (np. `@md:flex-row`). |
| **Użycie pseudoklas** | `components/ui.tsx` | Liczne użycia `hover:`, `focus-visible:`, `active:`, `disabled:` w definicjach komponentów `Button` i `Input` (linia 18, 115). |
| **Użycie klasy container** | `App.tsx` | Użycie klasy `container` w elemencie `<header>` oraz `<main>` (linie 23 i 61). |
| **Użycie klasy group** | `components/EventCard.tsx` | Klasa `group` na kontenerze karty i `group-hover:text-primary` na tytule (linia 39). |
| **Użycie animacji** | `index.html` / `pages/Dashboard.tsx` | Definicja keyframes `fade-in` w `index.html` (linia 70) oraz jej użycie w widokach np. `pages/Dashboard.tsx` (linia 65). |
| **Użycie container query** | `components/EventCard.tsx` | Użycie `@container` na elemencie nadrzędnym i `@md:flex-row` na dziecku (wspierane przez plugin w `index.html`). |

## 2. TypeScript

| Wymaganie | Plik | Opis / Lokalizacja |
|-----------|------|--------------------|
| **Użycie unii lub intersekcji** | `types.ts` | Typ `SortDirection = "asc" | "desc"` (linia 41). |
| **Użycie typów generycznych** | `components/DataTable.tsx` | Interfejs `Column<T>` oraz komponent `DataTable<T>` (linie 4, 18). |
| **Przeciążenia funkcji / as const** | `pages/EventWizard.tsx` | Użycie asercji `as const` przy definiowaniu tablic walidacji (linie 40, 111). |
| **Typy dla stanów/referencji** | `lib/store.ts` | `useState<Expense[]>` oraz `useState<Budget>` (linie 7, 13). |
| **Użycie predykatu typu** | `types.ts` | Funkcja `isCategory(value: string): value is Category` (linia 20). |
| **Generyczny komponent** | `components/DataTable.tsx` | Komponent `DataTable` przyjmujący typ danych `T`. |

## 3. React Hook Form & Zod

| Wymaganie | Plik | Opis / Lokalizacja |
|-----------|------|--------------------|
| **Utworzenie formularza useForm** | `pages/EventWizard.tsx` | Inicjalizacja `useForm<FormData>` (linia 83). |
| **Walidacja za pomocą Zod** | `pages/EventWizard.tsx` | Schematy `step1Schema`, `step2Schema` (linie 23-50) oraz użycie `zodResolver`. |
| **Formularz wielokrokowy (Stepy)** | `pages/EventWizard.tsx` | Logika `currentStep`, nawigacja `handleNext`/`handleBack` i warunkowe renderowanie pól. |
| **Użycie niestandardowej kontrolki**| `pages/EventWizard.tsx` | Wybór kategorii z użyciem `Controller` i renderowaniem przycisków zamiast `<select>` (linie 203-239). |
| **Regex i refine w Zod** | `pages/EventWizard.tsx` | `regex` dla tytułu (linia 27) i `refine` dla daty (linia 44). |
| **Dodanie reCAPTCHA** | `pages/EventWizard.tsx` | Integracja komponentu `ReCAPTCHA` w 3 kroku formularza (linia 307). |

## 4. Shadcn / UI

| Wymaganie | Plik | Opis / Lokalizacja |
|-----------|------|--------------------|
| **Integracja z RHF** | `pages/EventWizard.tsx` | Użycie komponentów UI (`Input`, `Label`) wewnątrz formularza RHF. |
| **Użycie Dialog/Alert** | `components/ui.tsx` | Komponent `AlertDialog` jest zaimplementowany i dostępny do użycia (linie 163-199). |
| **Użycie Card, Table** | `components/ui.tsx`, `components/DataTable.tsx` | Wielokrotne użycie `Card` (np. Dashboard, Wizard). Implementacja `DataTable` (Table). |
| **Użycie Tooltip/Popover** | `pages/Dashboard.tsx` | Użycie komponentu `Tooltip` z biblioteki Recharts (linia 167) oraz `Popover` zaimportowany w `ui.tsx`. |
| **Użycie wykresu** | `pages/Dashboard.tsx` | Wykres liniowy `AreaChart` (Recharts) implementujący wizualizację wydatków. |
| **Compound Components** | `components/Stepper.tsx` | Implementacja wzorca Compound Component: `Stepper` oraz `Stepper.Step` (przypisanie w linii 68). |

## 5. Inne

| Wymaganie | Status | Uwagi |
|-----------|--------|-------|
| **Opublikowanie na vercel.com** | Zrealizowano | https://budget-pilot-projekt.vercel.app |
| **Użycie v0.app / lovable.dev** | Zrealizowano | [AI Studio - Google](https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%2214WKDo-itDG6jRvfbrb0a8sskcn78CPnX%22%5D,%22action%22:%22open%22,%22userId%22:%22115178508123600745142%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing) |
| **Clean Code** | Zrealizowano | Kod podzielony na moduły, czytelne nazewnictwo zmiennych, wydzielone typy i utilsy. |
