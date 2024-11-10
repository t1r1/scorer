const NATIONAL_WAGE_BY_YEAR = {
  2024: {
    21: 11.44,
    20: 8.6,
    18: 6.4,
  },
  2025: {
    21: 12.21,
    20: 10.0,
    18: 7.55,
  },
};

// source: https://www.gov.uk/national-minimum-wage-rates
// a side note: these values would be better fetched from gov.uk or other APIs,
// but for simplicity and due task's time constraints, here it's harcoded

const MARKET_CURRENCY = "£"; // assume that this is default for the current market, for other markets it can be different and configurable in i18n settings.
