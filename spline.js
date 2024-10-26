const fs = require('fs');
const csv = require('csv-parser');
const spline = require('spline-js');

// read the CSV file and parse it into an array of objects
const data = [];
fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (row) => {
    data.push(row);
  })
  .on('end', () => {
    // extract the two columns as separate arrays
    const x = data.map((d) => parseFloat(d.column1));
    const y = data.map((d) => parseFloat(d.column2));

    // create the spline function
    const splineFunction = spline(x, y);
  });