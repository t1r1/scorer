const {
  getNationalWage,
  parseHourlyRate,
  getYear,
  hourlyRateScorer,
} = require("../index");

describe("Hourly rates scorer & parser", () => {
  const surveyData = {
    submitted_date: 1608211454000,
    age: 26,
    hourly_rate: "£8.72",
  };

  test("should parse hourly rate correctly", () => {
    expect(parseHourlyRate("£8.72")).toBe(8.72);
  });

  test("should get the correct year from submitted date", () => {
    expect(getYear(surveyData.submitted_date)).toBe(2020);
  });

  test("should return the correct national wage for age and year", () => {
    const nationalWage = getNationalWage(26, 2024);
    expect(nationalWage).toBe(11.44);
  });

  test("should return 1 if hourly rate meets or exceeds the national wage", () => {
    surveyData.hourly_rate = "£11.50";
    expect(hourlyRateScorer(surveyData)).toBe(1);
  });

  test("should return 0 if hourly rate is below the national wage", () => {
    surveyData.hourly_rate = "£8.00";
    expect(hourlyRateScorer(surveyData)).toBe(0);
  });
});
