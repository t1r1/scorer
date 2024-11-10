const fs = require("fs");

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

const MAX_EXCEDEENG_HOURS = 8;

// source: https://www.gov.uk/national-minimum-wage-rates
// a side note: these values would be better fetched from gov.uk or other APIs,
// but for simplicity and due task's time constraints, here it's harcoded

const MARKET_CURRENCY = "£"; // assuming this is the default currency for the current market. for other markets it can be different and configurable in i18n settings.

const SCORERS = {
  enjoys_job: yesOrNoScorer("enjoys_job"),
  respected_by_managers: yesOrNoScorer("respected_by_managers"),
  good_for_carers: yesOrNoScorer("good_for_carers"),
  working_hours: hoursScorer,
  unpaid_extra_work: yesOrNoScorer("unpaid_extra_work"),
  hourly_rate: hourlyRateScorer,
};

function getYear(submitted_date) {
  return new Date(submitted_date).getFullYear();
}

function parseHourlyRate(stringAmount) {
  return parseFloat(stringAmount.split(MARKET_CURRENCY)[1]);
}

function yesOrNoScorer(fieldName) {
  return function (survey) {
    return survey[fieldName] === "yes" ? 1 : 0;
  };
}

function getNationalWage(age, year) {
  if (!NATIONAL_WAGE_BY_YEAR[year]) {
    year = 2024; // FALLBACK, to be discussible. Another option would be throwing and logging an error in the monitoring like Sentry to explicitly know about failing year
  }
  const wages = NATIONAL_WAGE_BY_YEAR[year];

  if (age < 18) {
    return wages[18];
  }
  if (age >= 18 && age <= 20) {
    return wages[20];
  }
  return wages[21];
}

function hourlyRateScorer(survey) {
  surveyYear = getYear(survey.submitted_date);
  parsePaidAmount = parseHourlyRate(survey.hourly_rate);
  nationalWageForRespondent = getNationalWage(
    survey.age,
    surveyYear.toString()
  );
  return parsePaidAmount >= nationalWageForRespondent ? 1 : 0;
}

function hoursScorer(survey) {
  return survey.contracted_hours !== undefined &&
    survey.hours_actually_worked !== undefined &&
    survey.hours_actually_worked <=
      survey.contracted_hours + MAX_EXCEDEENG_HOURS
    ? 1
    : 0;
}

function main() {
  const filename = process.argv[2];
  if (!filename) {
    console.log("Usage: index.js <filename>");
    process.exit(1);
  }

  const raw = fs.readFileSync(filename);
  const answers = JSON.parse(raw);
  const result = calculateScore(answers);
  console.log(
    `Survey score: ${result.score}/${result.total} - ${result.percent}%`
  );
  return result;
}

function calculateScore(answers) {
  let score = 0;
  let total = Object.keys(SCORERS).length;

  for (const scorerName in SCORERS) {
    score += SCORERS[scorerName](answers);
    if (answers[scorerName] === "unsure") {
      // Missing answers do not contribute to the overall score.
      // Undefined, null, empty string also can be presented here, but within the time constraint I assume that all data validations, sanitanization had been performed before
      total -= 1;
    }
  }
  return {
    score,
    total,
    percent: (score / total) * 100,
  };
}

if (require.main === module) {
  main();
}

module.exports = {
  calculateScore,
  parseHourlyRate,
  getYear,
  getNationalWage,
  hourlyRateScorer,
};
