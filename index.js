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

// source: https://www.gov.uk/national-minimum-wage-rates
// a side note: these values would be better fetched from gov.uk or other APIs,
// but for simplicity and due task's time constraints, here it's harcoded

// {
// "enjoys_job": "yes",
// "repected_by_managers": "no",
// "good_for_carers": "yes",
// "contracted_hours": 20,
// "hours_actually_worked": 34,
// "unpaid_extra_work": "unsure", "age": 26,
// "hourly_rate": "£8.72",
// "submitted_date": 1608211454000
// }
const MARKET_CURRENCY = "£"; // assume that this is default for the current market, for other markets it can be different and configurable in i18n settings.

const SCORERS = [
  { name: "enjoys job", scorer: yesOrNoScorer("enjoys_job") },
  {
    name: "respected by managers",
    scorer: yesOrNoScorer("respected_by_managers"),
  },
  { name: "good for carers", scorer: yesOrNoScorer("good_for_carers") },
  { name: "work life balance", scorer: hoursScorer },
  { name: "unpaid extra work", scorer: yesOrNoScorer("unpaid_extra_work") },
  { name: "hourly rate", scorer: hourlyRateScorer },
];

function getYear(submitted_date) {
  return new Date(submitted_date).getFullYear();
}

function parseHourlyRate(stringAmount) {
  return parseFloat(stringAmount.split(MARKET_CURRENCY)[1]);
}

function yesOrNoScorer(fieldName) {
  return function (survey) {
    return survey[fieldName]?.toLowerCase() === "yes" ? 1 : 0;
  };
}

function getNationalWage(age, year) {
  if (!NATIONAL_WAGE_BY_YEAR[year]) {
    year = 2024;
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
    NATIONAL_WAGE_BY_YEAR,
    survey.age,
    surveyYear.toString()
  );
  return parsePaidAmount >= nationalWageForRespondent ? 1 : 0;
}

function hoursScorer(survey) {
  return survey.contracted_hours !== undefined &&
    survey.hours_actually_worked !== undefined &&
    survey.hours_actually_worked <= survey.contracted_hours + 8
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
  const accScore = calculateScore(answers);
  console.log(`Survey score: ${accScore}/${SCORERS.length}`);
}

function calculateScore(answers) {
  const accumulatedScore = SCORERS.reduce((accumulator, mapper) => {
    return accumulator + mapper["scorer"](answers);
  }, 0);
  return accumulatedScore;
}

main();
module.exports = calculateScore;
