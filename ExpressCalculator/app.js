const express = require('express');
const ExpressError = require('./expressError');

const app = express();


function validateNumsQueryParam(req, res, next) {
  try{
    console.log(req.query.nums);
    if(req.query.nums === undefined)
      throw new ExpressError('Please enter a list of numbers in the URL', 400);

    const nums = req.query.nums.split(',');

    if(checkForNaNs(nums).allNums === false) 
      throw new ExpressError(`'${checkForNaNs(nums).notNumbers.join(', ')}' are not numbers`, 400);

    req.query.nums = nums.map(n => parseInt(n.trim()));
    return next();
  } catch(e) {
    return next(e);
  }
}
function checkForNaNs(nums) {
  const notNumbers = [];
  for (let num of nums) {
    if (isNaN(num)) {
      notNumbers.push(num);
    }
  }
  if (notNumbers.length > 0) {
    return { allNums: false, notNumbers: notNumbers };
  } else {
    return { allNums: true, notNumbers: [] };
  }
}

function getMean(nums) {
  let total = 0;
  for (let num of nums) {
    total += parseInt(num);
  }
  const mean = total / nums.length;
  return mean;
}

function getMedian(nums) {
  nums.sort((a, b) => a - b);
  const mid = Math.floor(nums.length / 2);
  let median;
  if (nums.length % 2 === 0) {
    median = (nums[mid] + nums[mid - 1]) / 2;
  } else {
    median = nums[mid];
  }
  return median;
}

function getMode(nums) {
  const modeObj = {};
  for (let num of nums) {
    if (modeObj[num] === undefined) {
      modeObj[num] = 1;
    } else {
      modeObj[num] += 1;
    }
  }

  let modes = [];
  let maxCount = 0;

  for (let key in modeObj) {
    if (modeObj[key] > maxCount) {
      modes = [key];
      maxCount = modeObj[key];
    } else if (modeObj[key] === maxCount) {
      modes.push(key);
    }
  }

  if (modes.length === 0 || modes.length === nums.length) {
    return undefined;
  } else {
    return modes;
  }
}

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});


app.get('/', (req, res) => {
  return res.status(400).send('Please enter a list of numbers in the URL')
});

app.get('/all', validateNumsQueryParam, (req, res) => {
  const nums = req.query.nums;

  let mean = getMean(nums);
  let mode = getMode(nums);
  let median = getMedian(nums);
  let response = {
    operation: "all",
    mean: mean,
    median: median,
    mode: mode
  }
  
  return res.json(response);
});

app.get('/mean', validateNumsQueryParam, (req, res) => {
  const nums = req.query.nums;
  let mean = getMean(nums);

  return res.send(`The mean is ${mean}`);
});

app.get('/median', validateNumsQueryParam, (req, res) => {
  const nums = req.query.nums;

  let median = getMedian(nums);

  return res.send(`The median is ${median}`);
});

app.get('/mode', validateNumsQueryParam, (req, res) => {
  const nums = req.query.nums;

  let mode = getMode(nums);

  return res.send(`The mode is ${mode}`);
});

app.use((req, res, next) => {
  const err = new ExpressError('Not Found', 404);
  return next(err);
});

app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.msg;

  return res.status(status).send(message);
});

app.listen(3000, () => {
  console.log('App on port 3000');
});


module.exports = app;