const calculateScore = require("./index");
const testData = {
  enjoys_job: "yes",
  repected_by_managers: "no",
  good_for_carers: "yes",
  contracted_hours: 20,
  hours_actually_worked: 34,
  unpaid_extra_work: "unsure",
  age: 26,
  hourly_rate: "£8.72",
  submitted_date: 1608211454000,
};

test("calculates the score", () => {
  expect(calculateScore(testData).toBe(60));
});
