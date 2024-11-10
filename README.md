# scorer

### Run:

To run the script:
`node index.js answers.json`

To run the test:
`npm i`
`npm run test`

### Sources:

1. https://www.geeksforgeeks.org/node-js-process-argv-property/ - here I found out how to get arguments from the console input to read a file

### Side notes:

1. I have fixed a typo in JSON for the "repected_by_managers" fields, so both in my code and in the file it is "respected_by_managers".
2. Without time constraints, I would write precise unit tests for the getNationalWage function, checking the output with various inputs. And also test this function output the along with the hourlyRates calculator.
3. Some later thoughts on the score processing: instead of outputting 1 or 0, it would be better to output "null" as well for the "unsure" or some misaligned values. So [here](https://github.com/t1r1/scorer/blob/master/index.js#L103):

```score += SCORERS[scorerName](answers);
  if (answers[scorerName] === "unsure")
```

instead of checking equality to "unsure", I'd better check if output is null and then don't calculate it towards the final score.
